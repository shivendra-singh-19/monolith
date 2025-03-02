import express from 'express';

import { api } from '../app';
import { CustomerAccountsAPI } from './CustomerAccountsAPI';
import { authenticateUser } from '../../middleware/AuthenticateUser';

export const CustomerAccountsRouter = express.Router();

CustomerAccountsRouter.post('/sign-up', api.http(CustomerAccountsAPI.signup));

CustomerAccountsRouter.post('/login', api.http(CustomerAccountsAPI.login));
