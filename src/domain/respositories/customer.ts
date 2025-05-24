import type { Customer } from '../entities/customer';

export interface CustomerRepository {
  create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
}
