import express from 'express';

import { api } from '../app';
import { CustomerAccountsAPI } from './CustomerAccountsAPI';

export const CustomerAccountsRouter = express.Router();

CustomerAccountsRouter.post(
  '/sign-up',
  api.http(CustomerAccountsAPI.createUser)
);

CustomerAccountsRouter.post('/login', api.http(CustomerAccountsAPI.loginUser));
