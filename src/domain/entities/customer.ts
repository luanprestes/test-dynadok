import { BaseEntity } from './base';

export class Customer extends BaseEntity {
  name!: string;
  email!: string;
  phone!: string;

  constructor(data: Omit<Customer, keyof BaseEntity>) {
    super();
    Object.assign(this, data);
  }
}
