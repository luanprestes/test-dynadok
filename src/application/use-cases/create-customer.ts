import { Customer, CustomerProps } from '../../domain/entities/customer';
import type { ICustomerRepository } from '../../domain/respositories/customer';
import type { ICacheProvider } from '../../domain/providers/cache';
import type { IMessageProducer } from '../../domain/providers/message';
import type { CreateCustomerDTO } from '../dtos/create-customer';
import { Email } from '../../domain/entities/email';
import { Phone } from '../../domain/entities/phone';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DuplicateEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateEmailError';
  }
}

export class CreateCustomerUseCase {
  private readonly LIST_CACHE_KEY = 'customers:all';

  constructor(
    private repository: ICustomerRepository,
    private cache: ICacheProvider,
    private producer: IMessageProducer,
  ) {}

  async execute(data: CreateCustomerDTO) {
    const email = new Email(data.email).getValue();
    const phone = new Phone(data.phone).getValue();
    const props: CustomerProps = {
      name: data.name,
      email,
      phone,
    };

    try {
      await this.cache.del(this.LIST_CACHE_KEY);
    } catch {}

    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new DuplicateEmailError('O email informado já está cadastrado.');
    }

    const saved = await this.repository.create(new Customer(props));

    try {
      await this.producer.send('customer.created', saved);
    } catch (err) {}

    return saved;
  }
}
