import Joi from 'joi';

import { IRequestDoc, RequestDocModel } from '../../models/RequestModel';
import { GeneralUtils } from '../../utils/GeneralUtils';
import axios from 'axios';

export const MAX_PAGE_LIMIT = 4;

const cache = {};

export class RequestsApi {
  /**
   * To fetch all the all customer requests
   * @param object
   * @param options
   * @returns
   */
  static async fetchAllRequests(object: any, options: any) {
    const { query } = options;

    const { limit, skip, page } = GeneralUtils.parseOffsetPageParams(
      query,
      MAX_PAGE_LIMIT
    );

    const [totalRequests, requests] = await Promise.all([
      RequestDocModel.countDocuments().exec(),
      RequestDocModel.find({}).limit(limit).skip(skip).lean().exec(),
    ]);

    return {
      status: 'Success',
      total: totalRequests,
      page,
      requests,
    };
  }

  /**
   * Creating new request
   * @param object
   * @param options
   * @returns
   */
  static async createNewRequest(object: any, options: any) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        email: Joi.string().required(),
        projectTitle: Joi.string().required(),
        projectDescription: Joi.string().required(),
      })
    );

    const {
      firstName,
      lastName = '',
      email,
      projectTitle,
      projectDescription,
    } = object;

    const pushBody: IRequestDoc = {
      firstName,
      lastName,
      email,
      projectTitle,
      projectDescription,
      priority: 'high',
    };

    const request = await new RequestDocModel(pushBody).save();

    return {
      value: 'Success',
      request,
    };
  }

  /**
   * Updating the custom request
   * @param object
   * @param options
   */
  static async updateUserRequest(object: any, options: any) {
    const { params } = options;
    await GeneralUtils.validateParams(
      params,
      Joi.object({
        requestId: Joi.string().required(),
      })
    );

    await GeneralUtils.validateBody(
      object,
      Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string(),
        projectTitle: Joi.string(),
        projectDescription: Joi.string(),
      })
    );

    const { requestId } = params;

    const updatedRequest = await RequestDocModel.findOneAndUpdate(
      { _id: requestId },
      {
        $set: {
          firstName: object?.firstName,
          lastName: object?.lastName,
          email: object?.email,
          projectTitle: object?.projectTitle,
          projectDescription: object?.projectDescription,
        },
      },
      {
        new: true,
      }
    )
      .lean()
      .exec();

    return {
      message: 'Success',
      request: updatedRequest,
    };
  }

  /**
   * Deleting user request
   * @param object
   * @param options
   * @returns
   */
  static async deleteUserRequest(object: any, options: any) {
    const { params } = options;
    await GeneralUtils.validateParams(
      params,
      Joi.object({
        requestId: Joi.string().required(),
      })
    );

    const { requestId } = params;

    const updatedRequest = await RequestDocModel.findOneAndDelete({
      _id: requestId,
    })
      .lean()
      .exec();

    return {
      message: 'Deletion Successfull',
      request: updatedRequest,
    };
  }

  /**
   * Implementing caching
   * @param object
   * @param options
   * @returns
   */
  static async fetchLargeData(object, options) {
    if (cache['largeData']) {
      return {
        message: cache['largeData'],
      };
    }

    const { data } = await axios.get(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=Barack_Obama&rvprop=content'
    );

    cache['largeData'] = data;

    return {
      message: data,
    };
  }
}
