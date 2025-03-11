import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException();

    const isCorrect = await compare(password, user.password);
    if (!isCorrect) throw new UnauthorizedException();

    const fullUser = await this.usersService.findById(user.userId);
    const payload = { sub: user.userId, username: fullUser.username };
    return payload;
  }
}
