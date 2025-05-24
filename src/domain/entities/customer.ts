import { BaseEntity } from './base';

export interface CustomerProps {
  name: string;
  email: string;
  phone: string;
}

export class Customer extends BaseEntity {
  name!: string;
  email!: string;
  phone!: string;

  constructor(props: CustomerProps) {
    super();
    if (!props.name?.trim()) {
      throw new Error('O nome do cliente é obrigatório.');
    }
    this.name = props.name.trim();
    this.email = props.email;
    this.phone = props.phone;
  }
}
