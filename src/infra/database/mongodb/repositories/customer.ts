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
