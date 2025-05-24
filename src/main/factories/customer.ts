import { CreateCustomerUseCase } from '../../application/use-cases/create-customer';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer';
import { ListCustomersUseCase } from '../../application/use-cases/list-customer';
import { PrintCustomerLogUseCase } from '../../application/use-cases/print-customer-log';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer';
import { IMessageProducer } from '../../domain/providers/message';
import { redisCacheProvider } from '../../infra/cache/redis/providers/customer';
import { CustomerRepostoryMongoDB } from '../../infra/database/mongodb/repositories/customer';
import { RabbitProducer } from '../../infra/messaging/rabbit/producer';

let producerSingleton: IMessageProducer | null = null;

async function getProducer(): Promise<IMessageProducer> {
  if (!producerSingleton) {
    producerSingleton = new RabbitProducer();
    await (producerSingleton as RabbitProducer).connect();
  }
  return producerSingleton;
}

export async function makeCreateCustomer(): Promise<CreateCustomerUseCase> {
  const repo = new CustomerRepostoryMongoDB();
  const producer = await getProducer();
  return new CreateCustomerUseCase(repo, redisCacheProvider, producer);
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

export async function makePrintLogCustomerUseCase(): Promise<PrintCustomerLogUseCase> {
  return new PrintCustomerLogUseCase();
}
