import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { IMessageProducer } from '../../domain/providers/message';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { CreateCustomerDTO } from '../dtos/create-customer';
import { CreateCustomerUseCase } from './create-customer';

describe('CreateCustomerUseCase', () => {
  const LIST_KEY = 'customers:all';

  let repoMock: jest.Mocked<ICustomerRepository>;
  let cacheMock: jest.Mocked<ICacheProvider>;
  let producerMock: jest.Mocked<IMessageProducer>;
  let useCase: CreateCustomerUseCase;

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

    producerMock = {
      send: jest.fn(),
    };

    useCase = new CreateCustomerUseCase(repoMock, cacheMock, producerMock);
  });

  it('deve invalidar cache, criar cliente e publicar mensagem', async () => {
    const dto: CreateCustomerDTO = {
      name: 'João Silva',
      email: 'joao@example.com',
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
    expect(producerMock.send).toHaveBeenCalledWith('customer.created', saved);
    expect(result).toEqual(saved);
  });

  it('deve propagar erro do repositório e não enviar mensagem', async () => {
    const dto: CreateCustomerDTO = {
      name: 'Maria',
      email: 'maria@example.com',
      phone: '1198888-0000',
    };
    const error = new Error('falha ao criar cliente');
    repoMock.create.mockRejectedValue(error);

    await expect(useCase.execute(dto)).rejects.toThrow('falha ao criar cliente');

    expect(cacheMock.del).toHaveBeenCalledWith(LIST_KEY);
    expect(producerMock.send).not.toHaveBeenCalled();
  });
});
