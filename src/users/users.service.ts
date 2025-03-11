import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User> {
    return this.usersRepo.findOne({
      where: { username },
      select: ['password', 'userId'],
    });
  }

  async findById(userId: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { userId },
    });
    if (!user) throw new NotFoundException(`User with ID: ${userId} not found`);

    return user;
  }
}
