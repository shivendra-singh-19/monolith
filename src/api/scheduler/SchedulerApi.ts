import BullQueue from 'bull';
import { Job, Queue } from 'bullmq';
import { addMinutes, addSeconds, getTime } from 'date-fns';
import dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';
import mongoose from 'mongoose';
dotenv.config();

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const cronJobQueue = new BullQueue('RecurringTask', { redis: redisOptions });
const cronBullMqQueue = new Queue('Bull-Recurring-Tasks', {
  connection: redisOptions,
});

// cronBullMqQueue.setGlobalConcurrency(10);

export class SchedulerApi {
  /**
   * Adding 10k jobs in queue for bench
   * @param object
   * @param options
   * @returns
   */
  static async add10kJobs(object, options) {
    const startTime = new Date();
    const thirtySecondsLater = addSeconds(new Date(), 30);
    for (let i = 0; i < 10000; i++) {
      await cronJobQueue.add(
        {
          index: i,
          startTime,
        },
        {
          delay: getTime(thirtySecondsLater) - getTime(new Date()),
          removeOnComplete: true,
        }
      );
    }

    return {
      message: `Pushed 10k jobs in queue`,
    };
  }

  /**
   * Adding 1 job
   * @param object
   * @param options
   */
  static async addJob(object, options) {
    const startTime = new Date();
    const oneMinutesLater = addMinutes(new Date(), 1);
    cronJobQueue.add({
      key: '1 minute later',
      startTime,
    });

    return {
      message: 'Added 1 test job to queue',
    };
  }

  /**
   * Adding job in bull mq
   * @param object
   * @param options
   */
  static async addBullMqJob(object, options) {
    const startTime = new Date();
    const thirtySecondsLater = addSeconds(new Date(), 30);
    for (let i = 0; i < 10000; i++) {
      const uniqueId = new mongoose.Types.ObjectId();
      await cronBullMqQueue.add(
        uniqueId.toString(),
        { name: 'Himanshu', uniqueId: uniqueId, startTime },
        {
          delay: getTime(thirtySecondsLater) - getTime(new Date()),
          // repeat: {
          //   pattern: '* * * * * *',
          //   limit: 20,
          // },
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
    }

    return {
      message: 'Job has been added to the bull mq',
    };
  }

  /**
   * Change delay time
   * @param object
   * @param options
   */
  static async changeDelayInJob(object, options) {
    const { delay: newDelay } = object;

    const job = await Job.create(
      cronBullMqQueue,
      'RecurringTask',
      { name: 'Shivendra Singh' },
      { delay: newDelay }
    );
  }

  /**
   * Adding recurring bull mq job
   * @param object
   * @param options
   * @returns
   */
  static async addRecurringBullMqJob(object, options) {
    await cronBullMqQueue.add(
      'RecurringTask',
      { name: 'Shivendra Singh' },
      {
        repeat: {
          pattern: '*/5 * * * * *',
          limit: 10,
        },
        removeOnComplete: {
          //Keep job for 1 hour
          age: 3600,
          //Keep 1000 jobs
          count: 1000,
        },
        removeOnFail: true,
      }
    );

    return {
      message: 'recurring Job has been added to the bull mq',
    };
  }

  static async removeRecurringJob(object, options) {
    await cronBullMqQueue.removeRepeatable('RecurringTask', {
      pattern: '*/5 * * * * *',
      limit: 10,
    });

    return {
      message: 'Job removed',
    };
  }
}
