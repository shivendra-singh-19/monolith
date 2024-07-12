import { api } from '../app';
import express from 'express';
import { SkillsAPI } from './SkillsApi';

export const SkillsRouter = express.Router();

SkillsRouter.get('/', api.http(SkillsAPI.fetchAllSkills));
