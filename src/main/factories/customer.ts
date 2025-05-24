import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer';
import { CustomerRepostoryMongoDB } from '../../infra/database/mongodb/repositories/customer';

export async function makeCreateCustomer(): Promise<CreateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new CreateCustomerUseCase(repo);
}

export async function makeUpdateCustomerUseCase(): Promise<UpdateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new UpdateCustomerUseCase(repo);
}
