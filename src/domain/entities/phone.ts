export class Phone {
  private static readonly PHONE_REGEX = /^\d{10,11}$/;
  private readonly value: string;

  constructor(value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (!Phone.PHONE_REGEX.test(cleaned)) {
      throw new Error('O telefone deve conter 10 ou 11 dígitos numéricos.');
    }
    this.value = cleaned;
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
