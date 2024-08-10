import mongoose, { Schema } from 'mongoose';

type IAccessToken = {
  user: string;
  accessToken: string;
  refreshToken: string;
};

export const AccessTokenSchema = new Schema<IAccessToken>({
  user: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
});

AccessTokenSchema.index({ user: 1 }, { unique: true });

export const AccessTokenStatesModel = mongoose.model(
  'AccessTokenState',
  AccessTokenSchema,
  'AccessTokenStates'
);
