import Joi from 'joi';

import { NotFoundError } from '../../error/Errors';
import { ISkillsDoc, SkillsDocModel } from '../../models/SkillsModel';
import { GeneralUtils } from '../../utils/GeneralUtils';

export class SkillsAPI {
  /**
   * Fetching all the skills at once
   * @param object
   * @param options
   * @returns
   */
  static async fetchAllSkills(object: any, options: any) {
    const skills = await SkillsDocModel.find({}).lean().exec();
    return {
      message: 'Fetched skills successfully',
      skills,
    };
  }

  /**
   * Creating new skill
   * @param object
   * @param options
   * @returns
   */
  static async createNewSkill(object: any, options: any) {
    console.log(object);
    await GeneralUtils.validateBody(
      object,
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().required(),
      })
    );

    const { name, description, imageUrl } = object;
    const pushBody: ISkillsDoc = {
      name,
      description,
      imageUrl,
    };

    const newSkill = await new SkillsDocModel(pushBody).save();

    return {
      message: 'Skill created successfully',
      skill: newSkill,
    };
  }

  /**
   * Updating the existing skills
   * @param object
   * @param options
   * @returns
   */
  static async updateSkill(object: any, options: any) {
    const { params } = options;
    await GeneralUtils.validateParams(
      params,
      Joi.object({
        skillId: Joi.string().required(),
      })
    );

    await GeneralUtils.validateBody(
      object,
      Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        imageUrl: Joi.string(),
      })
    );

    const { skillId } = params;

    const updatedSkill = await SkillsDocModel.findOneAndUpdate(
      {
        _id: skillId,
      },
      {
        $set: {
          name: object?.name,
          description: object?.description,
          imageUrl: object?.imageUrl,
        },
      },
      {
        new: true,
      }
    )
      .lean()
      .exec();

    if (!updatedSkill) {
      throw new NotFoundError({
        message: `Skill ${skillId} not found.`,
      });
    }

    return {
      message: 'Skill updation successfull',
      skill: updatedSkill,
    };
  }

  /**
   * Deleting the existing skill
   * @param object
   * @param options
   * @returns
   */
  static async deleteSkill(object: any, options: any) {
    const { params } = options;
    await GeneralUtils.validateParams(
      params,
      Joi.object({
        skillId: Joi.string().required(),
      })
    );

    const { skillId } = params;
    const deletedSkill = await SkillsDocModel.findOneAndDelete({ _id: skillId })
      .lean()
      .exec();

    return {
      message: 'Skill deletion successfull',
      skill: deletedSkill,
    };
  }
}
