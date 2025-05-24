import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { CustomerRepostoryMongoDB } from '../../infra/database/mongodb/repositories/customer';

export async function makeCreateCustomer(): Promise<CreateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  return new CreateCustomerUseCase(repo);
}
