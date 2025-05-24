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
    } as unknown as jest.Mocked<ICacheProvider>;

    producerMock = {
      send: jest.fn(),
    } as unknown as jest.Mocked<IMessageProducer>;

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
});
