import { Customer, CustomerProps } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { IMessageProducer } from '../../domain/providers/message';
import type { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';

export class CreateCustomerUseCase {
  private readonly LIST_CACHE_KEY = 'customers:all';

  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
    private producer: IMessageProducer,
  ) {}

  async execute(data: CreateCustomerDTO) {
    const props = data as unknown as CustomerProps;
    const entity = new Customer(props);

    try {
      await this.cache.del(this.LIST_CACHE_KEY);
    } catch (_) {}

    const saved = await this.repository.create(entity);
    await this.producer.send('customer.created', saved);
    return saved;
  }
}
