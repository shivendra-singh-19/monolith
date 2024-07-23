import Joi from 'joi';

import { GeneralUtils } from '../../utils/GeneralUtils';

export class CustomerAccountsAPI {
  static async createUser(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      })
    );
  }
}
