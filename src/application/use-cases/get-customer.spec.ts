import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { GetCustomerUseCase } from './get-customer';

describe('GetCustomerUseCase', () => {
  let repoMock: jest.Mocked<ICustomerRepository>;
  let cacheMock: jest.Mocked<ICacheProvider>;
  let useCase: GetCustomerUseCase;
  const id = 'cust123';
  const now = new Date();
  const mockCustomer: Customer = {
    id,
    name: 'Fulano',
    email: 'fulano@test.com',
    phone: '1199000-0000',
    createdAt: now,
    updatedAt: now,
  };
  const cacheKey = `customer:${id}`;

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

    useCase = new GetCustomerUseCase(repoMock, cacheMock);
  });

  it('deve retornar do cache se existir (cache hit)', async () => {
    cacheMock.get.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(id);

    expect(cacheMock.get).toHaveBeenCalledWith(cacheKey);
    expect(repoMock.findById).not.toHaveBeenCalled();
    expect(result).toEqual(mockCustomer);
  });

  it('deve buscar no repositório e colocar no cache se não houver cache (cache miss)', async () => {
    cacheMock.get.mockResolvedValue(null);
    repoMock.findById.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(id);

    expect(cacheMock.get).toHaveBeenCalledWith(cacheKey);
    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(cacheMock.set).toHaveBeenCalledWith(cacheKey, mockCustomer, 3600);
    expect(result).toEqual(mockCustomer);
  });

  it('deve retornar null se cliente não existir', async () => {
    cacheMock.get.mockResolvedValue(null);
    repoMock.findById.mockResolvedValue(null);

    const result = await useCase.execute(id);

    expect(cacheMock.get).toHaveBeenCalledWith(cacheKey);
    expect(repoMock.findById).toHaveBeenCalledWith(id);
    expect(cacheMock.set).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
