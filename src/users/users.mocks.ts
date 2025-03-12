import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';

export const userMock: User = {
  userId: 1,
  username: 'test',
  password: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: async () => {},
};

export const userCreateMock: CreateUserDto = {
  username: 'test',
  password: 'test',
};
