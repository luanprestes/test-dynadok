export class Email {
  private static readonly EMAIL_REGEX = /^\S+@\S+\.\S+$/;
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(normalized)) {
      throw new Error('O email fornecido é inválido.');
    }
    this.value = normalized;
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
