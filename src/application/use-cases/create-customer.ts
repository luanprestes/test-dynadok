import type { Customer } from '../../domain/entities/customer';
import type { CustomerRepository } from '../../domain/respositories/customer';

export class CreateCustomerUseCase {
  constructor(private repository: CustomerRepository) {}

  async execute(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const saved = await this.repository.create(data);

    return saved;
  }
}
