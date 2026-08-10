import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterDto,
  type LoginDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
} from './dto/auth.schemas';

const REFRESH_COOKIE_NAME = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, refreshTokenExpiresAt, user } = await this.authService.register(dto);

    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);

    return { accessToken, user };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(loginSchema))
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, refreshTokenExpiresAt, user } = await this.authService.login(dto);

    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);

    return { accessToken, user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const { accessToken, refreshToken, refreshTokenExpiresAt } =
      await this.authService.refreshTokens(rawRefreshToken);

    this.setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    await this.authService.logout(rawRefreshToken);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  private setRefreshCookie(res: Response, token: string, expiresAt: Date) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.configService.get<string>('COOKIE_SECURE') === 'true' || isProd,
      // Em produção, front (Vercel) e back (Render) ficam em domínios diferentes —
      // isso é uma requisição cross-site do ponto de vista do navegador, e só
      // SameSite=None permite que o cookie seja enviado nesse caso (requer Secure=true,
      // já garantido acima via isProd). Em dev, front e back são ambos "localhost"
      // (mesmo site, independente da porta), então Lax funciona normalmente.
      sameSite: isProd ? 'none' : 'lax',
      // restringe o cookie apenas às rotas que precisam dele
      path: '/api/v1/auth',
      expires: expiresAt,
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
    });
  }
}
