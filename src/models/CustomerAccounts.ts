import mongoose, { Schema } from 'mongoose';

export type ICustomerAccounts = {
  email: string;
  passwordHash: string;
};

const CustomAccountsSchema = new Schema<ICustomerAccounts>({
  email: { type: String, required: true },
  passwordHash: { type: String },
});

CustomAccountsSchema.index({ email: 1 }, { unique: true });

export const CustomAccountsModel = mongoose.model(
  'CustomerAccount',
  CustomAccountsSchema,
  'CustomerAccounts'
);
