import { Schema, model, Document, Model } from 'mongoose';
export interface CustomerDocument extends Document {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true },
);

export const CustomerModel: Model<CustomerDocument> = model<CustomerDocument>(
  'Customer',
  CustomerSchema,
);
