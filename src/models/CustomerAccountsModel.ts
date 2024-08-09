import mongoose, { Schema } from 'mongoose';

export type ICustomerAccounts = {
  username: string;
  passwordHash: string;
};

const CustomAccountsSchema = new Schema<ICustomerAccounts>({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

CustomAccountsSchema.index({ username: 1 }, { unique: true });

export const CustomAccountsModel = mongoose.model(
  'CustomerAccount',
  CustomAccountsSchema,
  'CustomerAccounts'
);
