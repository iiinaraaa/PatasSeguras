import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

/**
 * Tokens de uso único (confirmação de e-mail, reset de senha, refresh token)
 * seguem o mesmo padrão:
 *
 * 1. Geramos um valor aleatório opaco e o enviamos ao usuário (e-mail ou cookie).
 * 2. Armazenamos APENAS o hash SHA-256 desse valor no banco.
 * 3. Ao validar, hasheamos o valor recebido e comparamos com o armazenado.
 *
 * Assim, mesmo que o banco seja comprometido, os tokens em si não podem ser
 * reutilizados — só o hash está lá, que é irreversível.
 */
@Injectable()
export class TokensService {
  generateOpaqueToken(): string {
    return randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
