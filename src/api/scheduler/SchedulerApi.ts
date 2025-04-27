import Joi, { object } from 'joi';
import { MessageProducer } from '../../amq/MessageProducer';
import { GeneralUtils } from '../../utils/GeneralUtils';

export class SchedulerApi {
  /**
   * Adding a job to the rabbitmq named scheduler
   * @param job
   */
  static async addJob(message: any) {
    const messageProducer = new MessageProducer('scheduler');
    try {
      await messageProducer.connect();
      await messageProducer.publishMessage(message);
      await messageProducer.close();
    } catch (err) {
      console.log(err);
    }
  }

  static async createNewMessage(object, options) {
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        message: Joi.string().required(),
      })
    );

    const { message } = object;

    await SchedulerApi.addJob(message);

    return {
      success: true,
      message: 'Job added to the scheduler',
    };
  }
}
