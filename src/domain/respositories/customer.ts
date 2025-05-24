import { CreateCustomerDTO } from '../../application/dtos/create-customer';
import { UpdateCustomerDTO } from '../../application/dtos/update-customer';
import type { Customer } from '../entities/customer';

export interface ICustomerRepository {
  create(data: CreateCustomerDTO): Promise<Customer>;
  update(id: string, data: UpdateCustomerDTO): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
