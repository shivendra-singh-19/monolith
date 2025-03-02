import Joi from 'joi';

import {
  CustomAccountsModel,
  ICustomerAccounts,
} from '../../models/CustomerAccountsModel';
import { GeneralUtils } from '../../utils/GeneralUtils';

require('dotenv').config();

const cache = {};

export class CustomerAccountsAPI {
  /**
   * Verify user login
   * @param object
   * @param options
   * @returns
   */
  static async login(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
    );

    const { username, password } = object;
    const user = await CustomAccountsModel.findOne({
      username,
      passwordHash: password,
    })
      .lean()
      .exec();

    if (!user) {
      return {
        isValid: false,
      };
    }

    return {
      isValid: true,
      user,
    };
  }

  /**
   * Signing up new user
   * @param object
   * @param options
   * @returns
   */
  static async signup(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        email: Joi.string().required(),
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
    );

    const { email, name, username, password } = object;
    const pushBody: ICustomerAccounts = {
      email,
      name,
      username,
      passwordHash: password,
    };

    const user = await new CustomAccountsModel(pushBody).save();
    return {
      message: 'User creation successfull',
      user,
    };
  }
}
