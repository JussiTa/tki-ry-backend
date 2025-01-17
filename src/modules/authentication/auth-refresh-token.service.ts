import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { AuthRefreshToken } from './auth-refresh-token.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { cookieConfig } from 'src/api/constants/cookies';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env/configuration';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
    @InjectRepository(AuthRefreshToken)
    private authRefreshTokenRepository: Repository<AuthRefreshToken>,
  ) {}

  async generateRefreshToken(
    authUser: Express.User,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUser.id, role: authUser.role },
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '30d',
      },
    );

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      const salt = await bcrypt.genSalt();

      const hashedRefreshToken = await bcrypt.hash(currentRefreshToken, salt);
      if (
        await this.isRefreshTokenBlackListed(hashedRefreshToken, authUser.id)
      ) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      await this.authRefreshTokenRepository.insert({
        refreshToken: hashedRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: authUser.id,
      });
    }

    return newRefreshToken;
  }

  private isRefreshTokenBlackListed(refreshToken: string, userId: number) {
    return this.authRefreshTokenRepository.existsBy({ refreshToken, userId });
  }

  async generateTokenPair(
    user: Express.User,
    res: Response,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { sub: user.id, role: user.role };

    res.cookie(
      cookieConfig.refreshToken.name,
      await this.generateRefreshToken(
        user,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
      {
        ...cookieConfig.refreshToken.options,
      },
    );

    return {
      access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      refresh_token: await this.generateRefreshToken(
        user,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.authRefreshTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }
}
