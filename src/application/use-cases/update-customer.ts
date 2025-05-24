import { Customer } from '../../domain/entities/customer';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { UpdateCustomerDTO } from '../dtos/update-customer';

export class UpdateCustomerUseCase {
  constructor(private repository: ICustomerRepository) {}

  async execute(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
    const updated = await this.repository.update(id, data as Partial<Customer>);
    return updated;
  }
}
