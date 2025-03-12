import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  createMockJwtService,
  createMockRepository,
} from '../mocks/repository.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const usersRepoToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: createMockJwtService(),
        },
        {
          provide: usersRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('Should return the user', async () => {
      const expected = { token: 'token' };
      jest.spyOn(service, 'signIn').mockImplementation(async () => expected);
      const loginMock = { username: 'username', password: 'password' };
      const result = await controller.signIn(loginMock);
      expect(result).toBe(expected);
      expect(service.signIn).toHaveBeenCalledWith(
        loginMock.username,
        loginMock.password,
      );
    });
  });
});
