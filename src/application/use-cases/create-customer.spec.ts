import { CreateCustomerUseCase } from './create-customer';
import type { Customer } from '../../domain/entities/customer';
import type { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';

describe('CreateCustomerUseCase', () => {
  let repositoryMock: jest.Mocked<ICustomerRepository>;
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    useCase = new CreateCustomerUseCase(repositoryMock);
  });

  it('deve chamar repository.create com os dados corretos e retornar o cliente salvo', async () => {
    const input = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '1199999-0000',
    };
    const now = new Date();
    const savedCustomer: Customer = {
      id: 'abc123',
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    repositoryMock.create.mockResolvedValue(savedCustomer);

    const result = await useCase.execute(input as unknown as CreateCustomerDTO);

    expect(repositoryMock.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(savedCustomer);
  });

  it('deve propagar erros lançados pelo repositório', async () => {
    const input = {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      phone: '1198888-0000',
    };
    const error = new Error('falha ao criar cliente');
    repositoryMock.create.mockRejectedValue(error);

    await expect(useCase.execute(input as unknown as CreateCustomerDTO)).rejects.toThrow(
      'falha ao criar cliente',
    );
  });
});
