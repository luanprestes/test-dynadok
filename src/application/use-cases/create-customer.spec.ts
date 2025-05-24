import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';
import { CreateCustomerUseCase } from './create-customer';

describe('CreateCustomerUseCase', () => {
  let repoMock: jest.Mocked<ICustomerRepository>;
  let cacheMock: jest.Mocked<ICacheProvider>;
  let useCase: CreateCustomerUseCase;

  const LIST_KEY = 'customers:all';

  beforeEach(() => {
    repoMock = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    useCase = new CreateCustomerUseCase(repoMock, cacheMock);
  });

  it('deve invalidar cache, criar e retornar o cliente', async () => {
    const dto: CreateCustomerDTO = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '1199999-0000',
    };
    const now = new Date();
    const saved: Customer = {
      id: 'abc123',
      ...dto,
      createdAt: now,
      updatedAt: now,
    };
    repoMock.create.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(cacheMock.del).toHaveBeenCalledWith(LIST_KEY);
    expect(repoMock.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(result).toEqual(saved);
  });

  it('deve propagar erros do repositório', async () => {
    const dto: CreateCustomerDTO = {
      name: 'Maria',
      email: 'maria@example.com',
      phone: '1198888-0000',
    };
    const error = new Error('falha ao criar cliente');
    repoMock.create.mockRejectedValue(error);

    await expect(useCase.execute(dto)).rejects.toThrow('falha ao criar cliente');
    expect(cacheMock.del).toHaveBeenCalledWith(LIST_KEY);
  });
});
