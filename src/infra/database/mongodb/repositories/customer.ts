import { Customer } from '../../../../domain/entities/customer';
import { ICustomerRepository } from '../../../../domain/respositories/customer';
import { CustomerDocument, CustomerModel } from '../schemas/costumer';
import { BaseRepository } from './base';

export class CustomerRepositoryMongoDB
  extends BaseRepository<CustomerDocument, Customer>
  implements ICustomerRepository
{
  constructor() {
    super(CustomerModel);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const doc = await CustomerModel.findOne({ email });
    return doc ? this.toDomain(doc as unknown as CustomerDocument) : null;
  }

  protected toDomain(doc: CustomerDocument): Customer {
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
