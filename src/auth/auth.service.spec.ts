import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  createMockJwtService,
  createMockRepository,
} from '../mocks/repository.mock';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let service: AuthService;
  const usersRepoToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signin', () => {
    describe('When user is found', () => {
      it('Should return the user', async () => {
        const expected = { token: 'token' };
        jest.spyOn(service, 'signIn').mockImplementation(async () => expected);
        const result = await service.signIn('username', 'password');
        expect(result).toEqual(expected);
      });
    });
  });
});
