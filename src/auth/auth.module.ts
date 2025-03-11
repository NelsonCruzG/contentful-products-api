import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { jwtOptions } from '../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule.register(jwtOptions)],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
