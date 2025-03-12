import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { userCreateMock, userMock } from './users.mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository;
  const productsRepoToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: productsRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository>(productsRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('Should return the user', async () => {
      repository.findOne.mockReturnValue(userMock);
      const user = await service.findByUsername(userMock.username);
      expect(user).toEqual(userMock);
    });
  });

  describe('findById', () => {
    describe('When user is found', () => {
      it('Should return the user', async () => {
        repository.findOne.mockReturnValue(userMock);
        const user = await service.findById(userMock.userId);
        expect(user).toEqual(userMock);
      });
    });

    describe('When user is not found', () => {
      it('Should throw an error', async () => {
        repository.findOne.mockReturnValue(null);
        try {
          await service.findById(userMock.userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('validateUsername', () => {
    describe('When username is available', () => {
      it('Should not throw an error', async () => {
        repository.findOne.mockReturnValue(null);
        await service.validateUsername(userMock.username);
      });
    });

    describe('When username is not available', () => {
      it('Should throw an error', async () => {
        repository.findOne.mockReturnValue(userMock);
        try {
          await service.validateUsername(userMock.username);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });

  describe('create', () => {
    it('Should create and return the user', async () => {
      repository.create.mockReturnValue(userMock);

      const plainedUser = plainToInstance(User, userMock);
      repository.save.mockReturnValue(plainedUser);
      const user = await service.create(userCreateMock);
      expect(user).toEqual(plainedUser);
    });
  });
});
