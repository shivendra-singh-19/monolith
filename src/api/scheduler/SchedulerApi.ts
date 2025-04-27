import Joi from 'joi';
import { MessageProducer } from '../../amq/MessageProducer';
import { GeneralUtils } from '../../utils/GeneralUtils';
import Queue from 'bull';
import dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';

import {
  DirectExchangeProducer,
  FanoutExchangeProducer,
  TopicExchangeProducer,
  HeadersExchangeProducer,
} from '../../amq/ExchangeTypes';

// Redis connection configuration
const redisConnection = {
  host: 'localhost',
  port: 6379,
};

dotenv.config();

// Redis options for Bull queue
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

// Create a Bull queue instance for recurring tasks
const cronJobQueue = new Queue('RecurringTask', { redis: redisOptions });

export class SchedulerApi {
  /**
   * Adds a job to RabbitMQ scheduler queue
   *
   * @param message - The message to be published to RabbitMQ
   *
   * Process:
   * 1. Creates a new MessageProducer instance for 'scheduler' queue
   * 2. Connects to RabbitMQ
   * 3. Publishes the message
   * 4. Closes the connection
   *
   * Error Handling:
   * - Logs errors but doesn't throw them to prevent API failure
   */
  static async addJob(message: any) {
    const messageProducer = new MessageProducer('scheduler');
    try {
      await messageProducer.connect();
      await messageProducer.publishMessage(message);
      await messageProducer.close();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Creates and validates a new message for the scheduler
   *
   * @param object - The request body containing the message
   * @param options - Additional options (not used in this function)
   *
   * Validation:
   * - Uses Joi to validate that the message is a required string
   *
   * Process:
   * 1. Validates the input
   * 2. Extracts the message from the object
   * 3. Adds the job to the scheduler
   * 4. Returns success response
   *
   * @returns {Object} - Success response with message
   */
  static async createNewMessage(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        message: Joi.string().required(),
      })
    );

    const { message } = object;

    await SchedulerApi.addJob(message);

    return {
      success: true,
      message: 'Job added to the scheduler',
    };
  }

  /**
   * Tests the Direct Exchange functionality
   *
   * Purpose:
   * - Demonstrates point-to-point messaging where messages are routed based on exact routing key matches
   *
   * Process:
   * 1. Creates a DirectExchangeProducer for 'direct-exchange'
   * 2. Connects to RabbitMQ
   * 3. Publishes a sample order message with routing key 'order.created'
   * 4. Closes the connection
   *
   * Message Structure:
   * {
   *   type: 'order',
   *   id: [timestamp],
   *   status: 'created'
   * }
   *
   * @returns {Object} - Success response with message
   */
  static async testDirectExchange(object, options) {
    const producer = new DirectExchangeProducer('direct-exchange');
    try {
      await producer.connect();
      await producer.publishMessage(
        { type: 'order', id: Date.now(), status: 'created' },
        'order.created'
      );
      return { success: true, message: 'Direct exchange message sent' };
    } catch (error) {
      console.error('Error in direct exchange:', error);
      throw error;
    } finally {
      await producer.close();
    }
  }

  /**
   * Tests the Fanout Exchange functionality
   *
   * Purpose:
   * - Demonstrates broadcast messaging where messages are sent to all bound queues
   * - Routing keys are ignored in fanout exchanges
   *
   * Process:
   * 1. Creates a FanoutExchangeProducer for 'fanout-exchange'
   * 2. Connects to RabbitMQ
   * 3. Publishes a system notification message
   * 4. Closes the connection
   *
   * Message Structure:
   * {
   *   type: 'notification',
   *   message: 'System update available',
   *   timestamp: [ISO timestamp]
   * }
   *
   * @returns {Object} - Success response with message
   */
  static async testFanoutExchange(object, options) {
    const producer = new FanoutExchangeProducer('fanout-exchange');
    try {
      await producer.connect();
      await producer.publishMessage({
        type: 'notification',
        message: 'System update available',
        timestamp: new Date().toISOString(),
      });
      return { success: true, message: 'Fanout exchange message broadcasted' };
    } catch (error) {
      console.error('Error in fanout exchange:', error);
      throw error;
    } finally {
      await producer.close();
    }
  }

  /**
   * Tests the Topic Exchange functionality
   *
   * Purpose:
   * - Demonstrates pattern-based routing where messages are routed based on wildcard patterns
   * - Uses * for single word and # for multiple words in routing keys
   *
   * Process:
   * 1. Creates a TopicExchangeProducer for 'topic-exchange'
   * 2. Connects to RabbitMQ
   * 3. Publishes a sample order message with routing key from options
   * 4. Closes the connection
   *
   * Message Structure:
   * {
   *   type: 'order',
   *   id: [timestamp],
   *   status: string,
   *   region: string
   * }
   *
   * Routing Key Pattern:
   * - 'order.*.created' matches messages like 'order.europe.created'
   * - 'order.*.shipped' matches messages like 'order.america.shipped'
   * - 'order.#' matches all order messages
   *
   * @returns {Object} - Success response with message
   */
  static async testTopicExchange(object, options) {
    const producer = new TopicExchangeProducer('topic-exchange');
    try {
      await producer.connect();
      const routingKey = options?.routingKey || 'order.europe.created';
      await producer.publishMessage(
        {
          type: 'order',
          id: Date.now(),
          status: object.status || 'created',
          region: object.region || 'europe',
        },
        routingKey
      );
      return { success: true, message: 'Topic exchange message sent' };
    } catch (error) {
      console.error('Error in topic exchange:', error);
      throw error;
    } finally {
      await producer.close();
    }
  }

  /**
   * Tests the Headers Exchange functionality
   *
   * Purpose:
   * - Demonstrates header-based routing where messages are routed based on message headers
   * - Can match all headers (x-match: all) or any headers (x-match: any)
   *
   * Process:
   * 1. Creates a HeadersExchangeProducer for 'headers-exchange'
   * 2. Connects to RabbitMQ
   * 3. Publishes a log message with specific headers
   * 4. Closes the connection
   *
   * Message Structure:
   * {
   *   type: 'log',
   *   level: 'error',
   *   message: 'Payment failed',
   *   timestamp: [ISO timestamp]
   * }
   *
   * Headers:
   * - priority: 'high'
   * - source: 'payment-service'
   * - environment: 'production'
   *
   * @returns {Object} - Success response with message
   */
  static async testHeadersExchange(object, options) {
    const producer = new HeadersExchangeProducer('headers-exchange');
    try {
      await producer.connect();
      await producer.publishMessageWithHeaders(
        {
          type: 'log',
          level: 'error',
          message: 'Payment failed',
          timestamp: new Date().toISOString(),
        },
        {
          priority: 'high',
          source: 'payment-service',
          environment: 'production',
        }
      );
      return { success: true, message: 'Headers exchange message sent' };
    } catch (error) {
      console.error('Error in headers exchange:', error);
      throw error;
    } finally {
      await producer.close();
    }
  }
}
