import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { ListCustomersUseCase } from './list-customer';

describe('ListCustomersUseCase', () => {
  let repoMock: jest.Mocked<ICustomerRepository>;
  let cacheMock: jest.Mocked<ICacheProvider>;
  let useCase: ListCustomersUseCase;

  const CACHE_KEY = 'customers:all';
  const TTL = 300;

  const sampleCustomers: Customer[] = [
    {
      id: '1',
      name: 'A',
      email: 'a@a.com',
      phone: '111',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02'),
    },
    {
      id: '2',
      name: 'B',
      email: 'b@b.com',
      phone: '222',
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-04'),
    },
  ];

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

    useCase = new ListCustomersUseCase(repoMock, cacheMock);
  });

  it('should return customers from cache if present', async () => {
    cacheMock.get.mockResolvedValue(sampleCustomers);

    const result = await useCase.execute();

    expect(cacheMock.get).toHaveBeenCalledWith(CACHE_KEY);
    expect(repoMock.findAll).not.toHaveBeenCalled();
    expect(cacheMock.set).not.toHaveBeenCalled();
    expect(result).toBe(sampleCustomers);
  });

  it('should fetch from repo and cache the result on cache miss', async () => {
    cacheMock.get.mockResolvedValue(null);
    repoMock.findAll.mockResolvedValue(sampleCustomers);

    const result = await useCase.execute();

    expect(cacheMock.get).toHaveBeenCalledWith(CACHE_KEY);
    expect(repoMock.findAll).toHaveBeenCalled();
    expect(cacheMock.set).toHaveBeenCalledWith(CACHE_KEY, sampleCustomers, TTL);
    expect(result).toBe(sampleCustomers);
  });

  it('should ignore cache.set errors and still return repo data', async () => {
    cacheMock.get.mockResolvedValue(null);
    repoMock.findAll.mockResolvedValue(sampleCustomers);
    cacheMock.set.mockRejectedValue(new Error('Redis down'));

    const result = await useCase.execute();

    expect(cacheMock.get).toHaveBeenCalledWith(CACHE_KEY);
    expect(repoMock.findAll).toHaveBeenCalled();
    expect(cacheMock.set).toHaveBeenCalledWith(CACHE_KEY, sampleCustomers, TTL);
    expect(result).toBe(sampleCustomers);
  });

  it('should return empty array when repo returns empty list', async () => {
    cacheMock.get.mockResolvedValue(null);
    repoMock.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(cacheMock.get).toHaveBeenCalledWith(CACHE_KEY);
    expect(repoMock.findAll).toHaveBeenCalled();
    expect(cacheMock.set).toHaveBeenCalledWith(CACHE_KEY, [], TTL);
    expect(result).toEqual([]);
  });
});
