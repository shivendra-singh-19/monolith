import express from 'express';
import { api } from '../app';
import { SchedulerApi } from './SchedulerApi';

export const ScheduledJobsRouter = express.Router();

ScheduledJobsRouter.post('/', api.http(SchedulerApi.addJob));

ScheduledJobsRouter.post('/bench', api.http(SchedulerApi.add10kJobs));

ScheduledJobsRouter.post('/v2', api.http(SchedulerApi.addBullMqJob));

ScheduledJobsRouter.post(
  '/v2/recurring',
  api.http(SchedulerApi.addRecurringBullMqJob)
);

ScheduledJobsRouter.delete(
  '/v2/recurring',
  api.http(SchedulerApi.removeRecurringJob)
);
