import { Injectable, Dependencies } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthInput } from './dto/auth.input';
import { RefreshTokenService } from './refreshToken.service';
import { v4 as uuid } from 'uuid';
import { User } from '../user/user.entity';

@Dependencies(UserService, JwtService, RefreshTokenService)
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(authInput: AuthInput) {
    const user = await this.userService.findUser(authInput.username);
    if (user && user.password === authInput.password) {
      return user;
    }
    return null;
  }

  async createAccessToken(user: User) {
    const payload = { userId: user.id, sub: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async createRefreshToken(user: User) {
    const refreshToken = uuid();
    await this.refreshTokenService.createRefreshToken(user, refreshToken);
    return refreshToken;
  }
}
