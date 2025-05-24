import { Customer } from '../../domain/entities/customer';
import { ICacheProvider } from '../../domain/providers/cache';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { UpdateCustomerDTO } from '../dtos/update-customer';
import { UpdateCustomerUseCase } from './update-customer';

describe('UpdateCustomerUseCase', () => {
  let repoMock: jest.Mocked<ICustomerRepository>;
  let cacheMock: jest.Mocked<ICacheProvider>;
  let useCase: UpdateCustomerUseCase;
  const id = 'cust123';
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

    useCase = new UpdateCustomerUseCase(repoMock, cacheMock);
  });

  it('deve invalidar cache e atualizar o cliente', async () => {
    const dto: UpdateCustomerDTO = { name: 'Novo', email: 'novo@test.com' };
    const now = new Date();
    const updatedCustomer: Customer = {
      id,
      name: dto.name!,
      email: dto.email!,
      phone: '1199999-0000',
      createdAt: now,
      updatedAt: now,
    };

    repoMock.update.mockResolvedValue(updatedCustomer);

    const result = await useCase.execute(id, dto);

    expect(cacheMock.del).toHaveBeenCalledWith(cacheKey);
    expect(repoMock.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(updatedCustomer);
  });

  it('deve retornar null se cliente não existir (repo.update → null)', async () => {
    const dto: UpdateCustomerDTO = { email: 'x@test.com' };

    repoMock.update.mockResolvedValue(null);

    const result = await useCase.execute(id, dto);

    expect(cacheMock.del).toHaveBeenCalledWith(cacheKey);
    expect(repoMock.update).toHaveBeenCalledWith(id, dto);
    expect(result).toBeNull();
  });

  it('deve propagar erros lançados pelo repositório', async () => {
    const dto: UpdateCustomerDTO = { name: 'Erro' };
    const error = new Error('update failed');

    repoMock.update.mockRejectedValue(error);

    await expect(useCase.execute(id, dto)).rejects.toThrow('update failed');
    expect(cacheMock.del).toHaveBeenCalledWith(cacheKey);
  });
});
