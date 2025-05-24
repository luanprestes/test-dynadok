import { Customer } from '../../../../domain/entities/customer';
import { ICustomerRepository } from '../../../../domain/respositories/customer';

export class CustomerRepostoryMongoDB implements ICustomerRepository {
  create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    throw new Error('Method not implemented.');
  }
}
