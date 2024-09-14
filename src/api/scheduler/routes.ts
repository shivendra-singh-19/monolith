import express from 'express';
import { api } from '../app';
import { SchedulerApi } from './SchedulerApi';

export const ScheduledJobsRouter = express.Router();

ScheduledJobsRouter.post('/', api.http(SchedulerApi.addJob));

ScheduledJobsRouter.post('/bench', api.http(SchedulerApi.add10kJobs));
