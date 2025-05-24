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
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
  }
}
