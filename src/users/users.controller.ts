import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ description: 'Returns the newly created user' })
  @ApiBadRequestResponse({ description: 'Returns a list of errors' })
  create(@Body() createDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createDto);
  }
}
