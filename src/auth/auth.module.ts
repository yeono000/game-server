import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RefreshTokenService } from './refreshToken.service';
import { RefreshToken } from './refreshToken.entity';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 30 * 60 },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    JwtAuthGuard,
    RefreshTokenService,
    JwtStrategy,
  ],
})
export class AuthModule {}
