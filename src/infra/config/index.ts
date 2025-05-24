import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/customers';
export const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
export const RABBIT_URL = process.env['RABBIT_URL'] ?? 'amqp://localhost:5672';
export const RABBIT_EXCH = process.env['RABBIT_EXCH'] ?? 'customer.exchange';
