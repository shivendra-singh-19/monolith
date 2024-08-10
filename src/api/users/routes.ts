import express from 'express';

import { api } from '../app';
import { CustomerAccountsAPI } from './CustomerAccountsAPI';
import { authenticateUser } from '../../middleware/AuthenticateUser';

export const CustomerAccountsRouter = express.Router();

CustomerAccountsRouter.post(
  '/sign-up',
  authenticateUser,
  api.http(CustomerAccountsAPI.createUser)
);

CustomerAccountsRouter.post('/login', api.http(CustomerAccountsAPI.loginUser));

CustomerAccountsRouter.get(
  '/',
  authenticateUser,
  api.http(CustomerAccountsAPI.fetchUser)
);
