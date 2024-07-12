import mongoose, { Schema } from 'mongoose';

export interface ISkillsDoc {
  name: string;
  description: string;
  imageUrl: string;
}

export const SkillsDocSchema = new Schema<ISkillsDoc>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

export const RequestDocModel = mongoose.model(
  'Skills',
  SkillsDocSchema,
  'Skills'
);
