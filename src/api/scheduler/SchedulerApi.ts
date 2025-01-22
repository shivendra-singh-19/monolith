import Queue from 'bull';
import { addMinutes, addSeconds, getTime } from 'date-fns';
import dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';
import { QueueInstance } from '../../QueueInstance';
import { redisClient } from '../..';
import { QueueEvents } from 'bullmq';

// Redis connection
const redisConnection = {
  host: 'localhost',
  port: 6379,
};

dotenv.config();

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const cronJobQueue = new Queue('RecurringTask', { redis: redisOptions });

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

  static async addJobToBullMq(object, options) {
    const refreshQueue = QueueInstance.getInstance('audience_refresh');

    const job = await refreshQueue.addBulk([
      {
        name: 'audience_refresh',
        data: { ...object },
        opts: { delay: 15, removeOnComplete: true, removeOnFail: true },
      },
      {
        name: 'audience_refresh',
        data: { ...object },
        opts: { delay: 10, removeOnComplete: true, removeOnFail: true },
      },
      {
        name: 'audience_refresh',
        data: { ...object },
        opts: { delay: 2, removeOnComplete: true, removeOnFail: true },
      },
    ]);

    const events = new QueueEvents('audience_refresh');
    const result = await Promise.all([job[0].waitUntilFinished(events)]);
    return {
      message: 'Pushed to queue',
      result,
    };
  }
}
