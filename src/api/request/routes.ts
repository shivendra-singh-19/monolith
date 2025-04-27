import * as express from 'express';

import { api } from '../app';
import { RequestsApi } from './RequestsApi';

export const RequestRouter = express.Router();

RequestRouter.get('/', api.http(RequestsApi.fetchAllRequests));

RequestRouter.post('/', api.http(RequestsApi.createNewRequest));

RequestRouter.put('/:requestId', api.http(RequestsApi.updateUserRequest));

RequestRouter.get('/large-data', api.http(RequestsApi.fetchLargeData));
