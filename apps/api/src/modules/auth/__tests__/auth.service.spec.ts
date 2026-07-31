import { ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

// Mocks simples de cada dependência — sem tocar em banco ou serviço externo real.
function buildService(overrides: Partial<Record<string, any>> = {}) {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    refreshToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    emailConfirmationToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    passwordResetToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    $transaction: jest.fn((ops) => Promise.all(ops)),
    ...overrides.prisma,
  };

  const jwtService = { signAsync: jest.fn().mockResolvedValue('fake.jwt.token') };
  const configService = { get: jest.fn() };
  const passwordService = {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    verify: jest.fn().mockResolvedValue(true),
  };
  const emailService = {
    sendEmailConfirmation: jest.fn().mockResolvedValue(undefined),
    sendPasswordReset: jest.fn().mockResolvedValue(undefined),
  };
  const tokensService = {
    generateOpaqueToken: jest.fn().mockReturnValue('raw-token'),
    hashToken: jest.fn().mockReturnValue('hashed-token'),
  };

  const service = new AuthService(
    prisma as any,
    jwtService as any,
    configService as any,
    passwordService as any,
    emailService as any,
    tokensService as any,
  );

  return { service, prisma, jwtService, passwordService, emailService, tokensService };
}

describe('AuthService', () => {
  describe('register', () => {
    it('cria o usuário e envia e-mail de confirmação quando o e-mail é novo', async () => {
      const { service, prisma, emailService } = buildService();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user-1', email: 'ana@example.com', fullName: 'Ana' });

      const result = await service.register({
        fullName: 'Ana',
        email: 'ana@example.com',
        password: 'senha1234',
        confirmPassword: 'senha1234',
      });

      expect(prisma.user.create).toHaveBeenCalled();
      expect(emailService.sendEmailConfirmation).toHaveBeenCalledWith('ana@example.com', 'Ana', 'raw-token');
      expect(result.userId).toBe('user-1');
    });

    it('rejeita cadastro com e-mail já existente', async () => {
      const { service, prisma } = buildService();
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({
          fullName: 'Ana',
          email: 'ana@example.com',
          password: 'senha1234',
          confirmPassword: 'senha1234',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('rejeita quando o usuário não existe', async () => {
      const { service, prisma } = buildService();
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ana@example.com', password: 'x', rememberMe: false }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejeita quando a senha está incorreta', async () => {
      const { service, prisma, passwordService } = buildService();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'ana@example.com',
        passwordHash: 'hash',
        isActive: true,
        emailVerified: true,
      });
      passwordService.verify.mockResolvedValue(false);

      await expect(
        service.login({ email: 'ana@example.com', password: 'errada', rememberMe: false }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejeita login quando o e-mail ainda não foi confirmado', async () => {
      const { service, prisma } = buildService();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'ana@example.com',
        passwordHash: 'hash',
        isActive: true,
        emailVerified: false,
      });

      await expect(
        service.login({ email: 'ana@example.com', password: 'senha1234', rememberMe: false }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('retorna tokens quando as credenciais são válidas', async () => {
      const { service, prisma } = buildService();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'ana@example.com',
        fullName: 'Ana',
        passwordHash: 'hash',
        isActive: true,
        emailVerified: true,
      });

      const result = await service.login({
        email: 'ana@example.com',
        password: 'senha1234',
        rememberMe: false,
      });

      expect(result.accessToken).toBe('fake.jwt.token');
      expect(result.refreshToken).toBe('raw-token');
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });
});
