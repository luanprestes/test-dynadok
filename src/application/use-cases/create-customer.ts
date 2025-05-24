import { Customer, CustomerProps } from '../../domain/entities/customer';
import type { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';

export class CreateCustomerUseCase {
  constructor(private repository: ICustomerRepository) {}

  async execute(data: CreateCustomerDTO) {
    const props = data as unknown as CustomerProps;
    const entity = new Customer(props);
    return this.repository.create(entity as unknown as CreateCustomerDTO);
  }
}
