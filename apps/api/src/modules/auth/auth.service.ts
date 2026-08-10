import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../common/utils/password.service';
import { EmailService } from '../email/email.service';
import { TokensService } from './tokens/tokens.service';
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.schemas';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1h
const REFRESH_TOKEN_TTL_MS_DEFAULT = 7 * 24 * 60 * 60 * 1000; // 7 dias
const REFRESH_TOKEN_TTL_MS_REMEMBER = 30 * 24 * 60 * 60 * 1000; // 30 dias

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens & { user: { id: string; fullName: string; email: string } }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      // Mensagem genérica de qualquer forma seria ideal contra enumeração de e-mail,
      // mas aqui optamos por clareza de UX no cadastro; o login nunca revela isso.
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
      },
    });

    // Cadastro já autentica direto — não há mais confirmação de e-mail.
    const tokens = await this.issueTokenPair(user.id, user.email, false);

    return {
      ...tokens,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  }

  async login(dto: LoginDto): Promise<AuthTokens & { user: { id: string; fullName: string; email: string } }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Mensagem idêntica para "usuário não existe" e "senha errada" — não revelar qual.
    const invalidCredentialsError = new UnauthorizedException('E-mail ou senha inválidos.');

    if (!user || !user.isActive) {
      throw invalidCredentialsError;
    }

    const passwordMatches = await this.passwordService.verify(user.passwordHash, dto.password);
    if (!passwordMatches) {
      throw invalidCredentialsError;
    }

    const tokens = await this.issueTokenPair(user.id, user.email, dto.rememberMe);

    return {
      ...tokens,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  }

  async refreshTokens(rawRefreshToken: string | undefined): Promise<AuthTokens> {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    const tokenHash = this.tokensService.hashToken(rawRefreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }

    // Rotação: revoga o token usado e emite um novo — se o mesmo token antigo
    // for reaproveitado depois (ex: token roubado), fica evidente e a sessão morre.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    return this.issueTokenPair(user.id, user.email, false);
  }

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return;

    const tokenHash = this.tokensService.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Resposta sempre igual, exista ou não o e-mail — evita enumeração de contas.
    const genericResponse = {
      message: 'Se o e-mail existir em nossa base, você receberá instruções em breve.',
    };

    if (!user) {
      return genericResponse;
    }

    const rawToken = this.tokensService.generateOpaqueToken();
    const tokenHash = this.tokensService.hashToken(rawToken);

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    });

    try {
      await this.emailService.sendPasswordReset(user.email, user.fullName, rawToken);
    } catch (error) {
      this.logger.error('Falha ao enviar e-mail de recuperação de senha', error as Error);
      // Não expor falha de envio ao cliente — resposta genérica permanece a mesma.
    }

    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.tokensService.hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const newPasswordHash = await this.passwordService.hash(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: newPasswordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      // Por segurança, redefinir a senha invalida todas as sessões ativas.
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso. Faça login novamente.' };
  }

  // ---------- helpers privados ----------

  private async issueTokenPair(userId: string, email: string, rememberMe: boolean): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync({ sub: userId, email });

    const rawRefreshToken = this.tokensService.generateOpaqueToken();
    const refreshTokenHash = this.tokensService.hashToken(rawRefreshToken);
    const ttl = rememberMe ? REFRESH_TOKEN_TTL_MS_REMEMBER : REFRESH_TOKEN_TTL_MS_DEFAULT;
    const refreshTokenExpiresAt = new Date(Date.now() + ttl);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken, refreshTokenExpiresAt };
  }
}
