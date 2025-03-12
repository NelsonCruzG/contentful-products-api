import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import { User } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userCreateMock, userMock } from './users.mocks';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: MockRepository;
  const usersRepoToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: usersRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository>(usersRepoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Should create and return the user', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => userMock);

      repository.create.mockReturnValue(userMock);
      repository.save.mockReturnValue(userMock);
      const user = await controller.create(userCreateMock);

      expect(user).toEqual(userMock);
      expect(service.create).toHaveBeenCalledWith(userCreateMock);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
