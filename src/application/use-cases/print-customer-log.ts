import { Customer } from '../../domain/entities/customer';

export class PrintCustomerLogUseCase {
  async execute(customer: Customer): Promise<void> {
    console.log('📨 [customer.created] →', customer);
  }
}
