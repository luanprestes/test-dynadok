import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';

export class ListCustomersUseCase {
  private readonly CACHE_KEY = 'customers:all';
  private readonly TTL = 300;

  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
  ) {}

  async execute(): Promise<Customer[]> {
    const cached = await this.cache.get<Customer[]>(this.CACHE_KEY);
    if (cached) return cached;

    const list = await this.repository.findAll();

    try {
      await this.cache.set(this.CACHE_KEY, list, this.TTL);
    } catch (_) {}

    return list;
  }
}
