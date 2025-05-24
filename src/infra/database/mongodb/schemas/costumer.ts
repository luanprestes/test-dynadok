import mongoose, { Model, Schema } from 'mongoose';
import { Customer } from '../../../../domain/entities/customer';

interface CustomerDocument extends Customer, Document {}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
  },
  { timestamps: true },
);

export const CustomerModel: Model<CustomerDocument> =
  mongoose.models['Customer'] || mongoose.model<CustomerDocument>('Customer', CustomerSchema);
