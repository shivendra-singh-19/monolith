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

SkillsDocSchema.index({ name: 1 }, { unique: true });

export const SkillsDocModel = mongoose.model(
  'Skill',
  SkillsDocSchema,
  'Skills'
);
