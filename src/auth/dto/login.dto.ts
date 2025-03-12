import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: `User's name` })
  @IsString()
  @Length(8, 50)
  username: string;

  @ApiProperty({ description: `User's password` })
  @IsString()
  @MinLength(8)
  password: string;
}
