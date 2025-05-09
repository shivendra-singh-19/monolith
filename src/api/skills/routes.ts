import * as express from 'express';

import { authenticateUser } from '../../middleware/AuthenticateUser';
import { api } from '../app';
import { SkillsAPI } from './SkillsApi';

export const SkillsRouter = express.Router();

SkillsRouter.post('/', api.http(SkillsAPI.createNewSkill));

SkillsRouter.get('/', authenticateUser, api.http(SkillsAPI.fetchAllSkills));

SkillsRouter.put('/:skillId', api.http(SkillsAPI.updateSkill));

SkillsRouter.delete('/:skillId', api.http(SkillsAPI.deleteSkill));
