import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refreshToken.entity';
import { User } from '../user/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<RefreshToken> {
    const newRefreshToken = new RefreshToken();
    newRefreshToken.user = user;
    newRefreshToken.refreshToken = refreshToken;
    return await this.refreshTokenRepository.save(newRefreshToken);
  }

  async findRefreshToken(token: string): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne({
      where: { refreshToken: token },
      relations: ['user'],
    });
  }

  async deleteRefreshTokenById(refreshTokenId: number): Promise<void> {
    await this.refreshTokenRepository.delete(refreshTokenId);
  }
}
