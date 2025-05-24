import type { Customer } from '../entities/customer';

export interface ICustomerRepository {
  create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
}
