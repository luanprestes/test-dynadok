import { CreateCustomerUseCase } from './create-customer';
import type { Customer } from '../../domain/entities/customer';
import type { CustomerRepository } from '../../domain/respositories/customer';

describe('CreateCustomerUseCase', () => {
  let repositoryMock: jest.Mocked<CustomerRepository>;
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
    } as unknown as jest.Mocked<CustomerRepository>;

    useCase = new CreateCustomerUseCase(repositoryMock);
  });

  it('deve chamar repository.create com os dados corretos e retornar o cliente salvo', async () => {
    const input = {
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      telefone: '1199999-0000',
    };
    const now = new Date();
    const savedCustomer: Customer = {
      id: 'abc123',
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    repositoryMock.create.mockResolvedValue(savedCustomer);

    const result = await useCase.execute(input);

    expect(repositoryMock.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(savedCustomer);
  });

  it('deve propagar erros lançados pelo repositório', async () => {
    const input = {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      telefone: '1198888-0000',
    };
    const error = new Error('falha ao criar cliente');
    repositoryMock.create.mockRejectedValue(error);

    await expect(useCase.execute(input)).rejects.toThrow('falha ao criar cliente');
  });
});
