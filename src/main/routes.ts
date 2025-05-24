import express, { Application } from 'express';
import { makeCreateCustomer } from './factories/customer';
import { customerRouter } from '../adapters/controllers/customer';

export async function registerRoutes(app: Application): Promise<void> {
  app.use(express.json());

  const createUC = await makeCreateCustomer();

  app.use('/customers', customerRouter(createUC));
}
