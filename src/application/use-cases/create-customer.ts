import { Customer } from '../../domain/entities/customer';
import type { ICustomerRepository } from '../../domain/respositories/customer';

export class CreateCustomerUseCase {
  constructor(private repository: ICustomerRepository) {}

  async execute(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const entity = new Customer(data);
    return this.repository.create(entity);
  }
}
