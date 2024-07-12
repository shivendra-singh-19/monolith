import mongoose, { Schema } from 'mongoose';

export const REQUEST_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export interface IRequestDoc {
  firstName: string;
  lastName: string;
  email: string;
  priority: string;
  projectTitle: string;
  projectDescription: string;
}

export const RequestDocSchema = new Schema<IRequestDoc>({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  priority: {
    type: String,
    default: REQUEST_PRIORITIES.MEDIUM,
  },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
});

RequestDocSchema.index({
  email: 1,
});

export const RequestDocModel = mongoose.model(
  'Request',
  RequestDocSchema,
  'Requests'
);
