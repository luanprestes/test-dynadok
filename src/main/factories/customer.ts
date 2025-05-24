import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer';
import { ListCustomersUseCase } from '../../application/use-cases/list-customer';
import { PrintCustomerLogUseCase } from '../../application/use-cases/print-customer-log';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer';
import { redisCacheProvider } from '../../infra/cache/redis/providers/customer';
import { CustomerRepositoryMongoDB } from '../../infra/database/mongodb/repositories/customer';
import { getProducer } from '../../infra/messaging/rabbit/config';

export async function makeCreateCustomer(): Promise<CreateCustomerUseCase> {
  const repo = new CustomerRepositoryMongoDB();
  const producer = await getProducer();
  return new CreateCustomerUseCase(repo, redisCacheProvider, producer);
}

export async function makeUpdateCustomerUseCase(): Promise<UpdateCustomerUseCase> {
  const repo = new CustomerRepositoryMongoDB();
  return new UpdateCustomerUseCase(repo, redisCacheProvider);
}

export async function makeGetCustomerUseCase(): Promise<GetCustomerUseCase> {
  const repo = new CustomerRepositoryMongoDB();
  return new GetCustomerUseCase(repo, redisCacheProvider);
}

export async function makeListCustomerUseCase(): Promise<ListCustomersUseCase> {
  const repo = new CustomerRepositoryMongoDB();
  return new ListCustomersUseCase(repo, redisCacheProvider);
}

export async function makePrintLogCustomerUseCase(): Promise<PrintCustomerLogUseCase> {
  return new PrintCustomerLogUseCase();
}
