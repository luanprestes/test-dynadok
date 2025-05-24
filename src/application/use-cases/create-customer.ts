import { Customer, CustomerProps } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import type { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';

export class CreateCustomerUseCase {
  private readonly LIST_CACHE_KEY = 'customers:all';

  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
  ) {}

  async execute(data: CreateCustomerDTO) {
    const props = data as unknown as CustomerProps;
    const entity = new Customer(props);

    try {
      await this.cache.del(this.LIST_CACHE_KEY);
    } catch (_) {}

    return this.repository.create(entity as unknown as CreateCustomerDTO);
  }
}
