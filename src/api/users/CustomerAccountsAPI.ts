import Joi from 'joi';
import jwt from 'jsonwebtoken';

import {
  CustomAccountsModel,
  ICustomerAccounts,
} from '../../models/CustomerAccountsModel';
import { GeneralUtils } from '../../utils/GeneralUtils';
import { UserUtils } from '../../utils/UserUtils';

require('dotenv').config();

export class CustomerAccountsAPI {
  static async createUser(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
    );

    const { username, password } = object;

    const encryptedPassword = await UserUtils.encryptPlainText(password);
    const pushBody: ICustomerAccounts = {
      username,
      passwordHash: encryptedPassword,
    };
    const user = await new CustomAccountsModel(pushBody).save();
    return {
      message: 'User saved successfully',
    };
  }

  /**
   * To verify and login user
   * @param object
   * @param options
   * @returns
   */
  static async loginUser(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
    );

    const { username, password } = object;
    /**
     * To-do
     * Verification of username and password if they exist in db
     */
    const user = { username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15s',
    });

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Creating test API for fetching user
   * @param object
   * @param options
   * @returns
   */
  static async fetchUser(object, options) {
    const { user } = options;
    return {
      user,
    };
  }
}
