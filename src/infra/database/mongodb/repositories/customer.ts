import { CreateCustomerDTO } from '../../../../application/dtos/create-customer';
import { UpdateCustomerDTO } from '../../../../application/dtos/update-customer';
import { Customer } from '../../../../domain/entities/customer';
import { ICustomerRepository } from '../../../../domain/respositories/customer';
import { CustomerDocument, CustomerModel } from '../schemas/costumer';

export class CustomerRepostoryMongoDB implements ICustomerRepository {
  async update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
    const doc = await CustomerModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
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
