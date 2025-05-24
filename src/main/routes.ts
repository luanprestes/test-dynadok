import express, { Application } from 'express';
import { makeCreateCustomer, makeUpdateCustomerUseCase } from './factories/customer';
import { customerRouter } from '../adapters/controllers/customer';

export async function registerRoutes(app: Application): Promise<void> {
  app.use(express.json());

  const createUC = await makeCreateCustomer();
  const updateUC = await makeUpdateCustomerUseCase();

  app.use('/customers', customerRouter(createUC, updateUC));
}
