import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { UpdateCustomerDTO } from '../dtos/update-customer';

export class UpdateCustomerUseCase {
  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
  ) {}

  async execute(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
    const cacheKey = `customer:${id}`;
    try {
      await this.cache.del(cacheKey);
    } catch (_) {}

    const updated = await this.repository.update(id, data as Partial<Customer>);
    return updated;
  }
}
