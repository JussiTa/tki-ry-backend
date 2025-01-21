import {
  Controller,
  Post,
  UseGuards,
  Get,
  InternalServerErrorException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User as UserEntity } from 'src/modules/users/users.entity';
import { User } from './decorators/user.decorator';
import { UserLoginDto } from 'src/modules/users/dto/user-login.dto';
import { Public } from './decorators/public.decorator';
import { Response, Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import {
  cookieConfig,
  extractRefreshTokenFromCookies,
} from 'src/api/constants/cookies';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authRefreshTokenService: AuthRefreshTokenService,
  ) {}
  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @ApiBody({ type: UserLoginDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async me(
    @User() authUser: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Cache-Control', 'no-store');
    return authUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  async logout(@Req() req: any) {
    return req.logout();
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.generateTokenPair(
      (req.user as any).attributes,
      res,
      extractRefreshTokenFromCookies(req) as string,
      (req.user as any).refreshTokenExpiresAt,
    );
  }

  @Public()
  @Post('clear-auth-cookie')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(cookieConfig.refreshToken.name);
  }
}
