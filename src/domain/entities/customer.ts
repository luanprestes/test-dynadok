import { BaseEntity } from './base';

export class Customer extends BaseEntity {
  nome!: string;
  email!: string;
  telefone!: string;

  constructor(data: Omit<Customer, keyof BaseEntity>) {
    super();
    Object.assign(this, data);
  }
}
