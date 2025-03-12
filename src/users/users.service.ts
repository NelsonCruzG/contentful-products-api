import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

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

  async validateUsername(username: string): Promise<void> {
    const user = await this.findByUsername(username);
    if (user) {
      throw new BadRequestException(
        `User with username: $${username} already exists`,
      );
    }
  }

  async create(createDto: CreateUserDto): Promise<User> {
    await this.validateUsername(createDto.username);
    const toBeSaved = this.usersRepo.create(createDto);
    const user = await this.usersRepo.save(toBeSaved);
    return plainToInstance(User, user);
  }
}
