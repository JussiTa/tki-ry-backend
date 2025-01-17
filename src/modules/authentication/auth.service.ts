import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { User } from 'src/modules/users/users.entity';
import * as bcrypt from 'bcrypt';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    //private jwtService: JwtService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  // async login(
  //   username: string,
  //   pass: string,
  // ): Promise<{ access_token: string }> {
  //   const user = await this.usersService.findOne(username);
  //   const match = await bcrypt.compare(pass, user.password);

  //   if (!match) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user.id, username: user.userName };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  async login(res: Response, user?: Express.User) {
    if (!user?.id) {
      throw new InternalServerErrorException('User is not set in rquest');
    }
    return this.authRefreshTokenService.generateTokenPair(user, res);
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    const match = await bcrypt.compare(pass, user.password);

    if (!match) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
