import express from 'express';
import { api } from '../app';
import { SchedulerApi } from './SchedulerApi';

export const ScheduledJobsRouter = express.Router();

// Test Direct Exchange
ScheduledJobsRouter.post(
  '/test/direct-exchange',
  api.http(SchedulerApi.testDirectExchange)
);

// Test Fanout Exchange
ScheduledJobsRouter.post(
  '/test/fanout-exchange',
  api.http(SchedulerApi.testFanoutExchange)
);

// Test Topic Exchange
ScheduledJobsRouter.post(
  '/test/topic-exchange',
  api.http(SchedulerApi.testTopicExchange)
);

// Test Headers Exchange
ScheduledJobsRouter.post(
  '/test/headers-exchange',
  api.http(SchedulerApi.testHeadersExchange)
);

ScheduledJobsRouter.post('/', api.http(SchedulerApi.createNewMessage));
