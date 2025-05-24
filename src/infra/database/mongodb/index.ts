import mongoose from 'mongoose';
import { MONGO_URI } from '../../config';

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}
