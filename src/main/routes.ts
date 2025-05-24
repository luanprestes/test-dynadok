import express, { Application } from 'express';
import {
  makeCreateCustomer,
  makeGetCustomerUseCase,
  makeUpdateCustomerUseCase,
  makeListCustomerUseCase,
} from './factories/customer';
import { customerRouter } from './adapters/controllers/customer';

export async function registerRoutes(app: Application): Promise<void> {
  app.use(express.json());

  const createUC = await makeCreateCustomer();
  const updateUC = await makeUpdateCustomerUseCase();
  const getUC = await makeGetCustomerUseCase();
  const listUC = await makeListCustomerUseCase();

  app.use('/customers', customerRouter(createUC, updateUC, getUC, listUC));
}
