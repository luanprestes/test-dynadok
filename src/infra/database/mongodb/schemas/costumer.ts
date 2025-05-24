import mongoose, { Model, Schema } from 'mongoose';
import { Customer } from '../../../../domain/entities/customer';

export interface CustomerDocument extends Customer, Document {
  toObject(): unknown;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true },
);

export const CustomerModel: Model<CustomerDocument> =
  mongoose.models['Customer'] || mongoose.model<CustomerDocument>('Customer', CustomerSchema);
