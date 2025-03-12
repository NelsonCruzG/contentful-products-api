import { Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: `User's name` })
  @Length(8, 50)
  username: string;

  @ApiProperty({ description: `User's password` })
  @MinLength(8)
  readonly password: string;
}
