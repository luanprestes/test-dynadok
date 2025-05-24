import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer';
import { ListCustomersUseCase } from '../../application/use-cases/list-customer';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer';
import { redisCacheProvider } from '../../infra/cache/redis/providers/customer';
import { CustomerRepostoryMongoDB } from '../../infra/database/mongodb/repositories/customer';

export async function makeCreateCustomer(): Promise<CreateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new CreateCustomerUseCase(repo, redisCacheProvider);
}

export async function makeUpdateCustomerUseCase(): Promise<UpdateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new UpdateCustomerUseCase(repo, redisCacheProvider);
}

export async function makeGetCustomerUseCase(): Promise<GetCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new GetCustomerUseCase(repo, redisCacheProvider);
}

export async function makeListCustomerUseCase(): Promise<ListCustomersUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new ListCustomersUseCase(repo, redisCacheProvider);
}
