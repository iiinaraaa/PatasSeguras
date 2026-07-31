import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

// Centraliza o hashing de senha — se um dia precisarmos trocar o algoritmo
// (ex: ajustar parâmetros de custo), é o único lugar a mudar.
@Injectable()
export class PasswordService {
  private readonly options: argon2.Options = {
    type: argon2.argon2id,
    memoryCost: 19456, // ~19 MB — recomendação OWASP para argon2id
    timeCost: 2,
    parallelism: 1,
  };

  hash(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword, this.options);
  }

  verify(hash: string, plainPassword: string): Promise<boolean> {
    return argon2.verify(hash, plainPassword);
  }
}
