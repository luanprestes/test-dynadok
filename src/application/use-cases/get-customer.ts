import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';

export class GetCustomerUseCase {
  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
  ) {}

  async execute(id: string): Promise<Customer | null> {
    const cacheKey = `customer:${id}`;
    const cached = await this.cache.get<Customer>(cacheKey);
    if (cached) {
      return cached;
    }

    const customer = await this.repository.findById(id);
    if (customer) {
      await this.cache.set(cacheKey, customer, 3600);
    }
    return customer;
  }
}
