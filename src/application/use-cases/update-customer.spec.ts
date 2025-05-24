import { Customer } from '../../domain/entities/customer';
import { ICustomerRepository } from '../../domain/respositories/customer';
import { UpdateCustomerDTO } from '../dtos/update-customer';
import { UpdateCustomerUseCase } from './update-customer';

describe('UpdateCustomerUseCase', () => {
  let repositoryMock: jest.Mocked<ICustomerRepository>;
  let useCase: UpdateCustomerUseCase;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    useCase = new UpdateCustomerUseCase(repositoryMock);
  });

  it('should call repository.update with correct id and data, and return updated customer', async () => {
    const id = 'cust123';
    const dto: UpdateCustomerDTO = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };
    const now = new Date();
    const updatedCustomer: Customer = {
      id,
      name: dto.name!,
      email: dto.email!,
      phone: '1199999-0000',
      createdAt: now,
      updatedAt: now,
    };

    repositoryMock.update.mockResolvedValue(updatedCustomer);

    const result = await useCase.execute(id, dto);

    expect(repositoryMock.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(updatedCustomer);
  });

  it('should return null if repository.update returns null', async () => {
    const id = 'nonexistent';
    const dto: UpdateCustomerDTO = { email: 'no@exist.com' };

    repositoryMock.update.mockResolvedValue(null);

    const result = await useCase.execute(id, dto);

    expect(repositoryMock.update).toHaveBeenCalledWith(id, dto);
    expect(result).toBeNull();
  });

  it('should propagate errors thrown by repository.update', async () => {
    const id = 'custError';
    const dto: UpdateCustomerDTO = { name: 'Error' };
    const error = new Error('update failed');

    repositoryMock.update.mockRejectedValue(error);

    await expect(useCase.execute(id, dto)).rejects.toThrow('update failed');
  });
});
