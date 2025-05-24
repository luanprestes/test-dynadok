import { Customer } from '../../../../domain/entities/customer';
import { ICustomerRepository } from '../../../../domain/respositories/customer';
import { CustomerDocument, CustomerModel } from '../schemas/costumer';

export class CustomerRepostoryMongoDB implements ICustomerRepository {
  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const doc = await CustomerModel.create(data);
    return this.toDomain(doc);
  }

  private toDomain(doc: CustomerDocument): Customer {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
