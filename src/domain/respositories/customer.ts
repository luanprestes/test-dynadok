import { CreateCustomerDTO } from '../../application/dtos/create-customer';
import type { Customer } from '../entities/customer';

export interface ICustomerRepository {
  create(data: CreateCustomerDTO): Promise<Customer>;
}
