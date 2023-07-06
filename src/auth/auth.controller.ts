import { AuthOutput } from './dto/auth.output';
import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from '../constants';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() authInput: AuthInput,
    @Req() request: Request,
  ): Promise<AuthOutput> {
    console.log('authInput', authInput);
    const user = await this.authService.login(authInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.authService.createAccessToken(user),
      this.authService.createRefreshToken(user),
    ]);
    request.res.cookie('refresh_token', refreshToken, {
      signed: true,
      httpOnly: true,
      path: '/',
    });
    request.res.cookie('id', user.id.toString(), {
      httpOnly: true,
      path: '/',
    });
    const authOutput: AuthOutput = {
      accessToken: accessToken,
      user: user,
    };
    return authOutput;
  }

  @Post('logout')
  async logout(@Req() request: Request): Promise<string> {
    request.res.clearCookie('refresh_token', { signed: true });
    request.res.clearCookie('id');
    return 'Logout success';
  }
}
