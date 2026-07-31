import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './modules/email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [
    // Variáveis de ambiente disponíveis em toda a aplicação
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting global — proteção base contra força bruta e abuso.
    // Endpoints sensíveis (login, registro, reset de senha) terão limites
    // mais estritos aplicados diretamente no controller (Etapa 2).
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requisições por IP por minuto (limite global "frouxo")
      },
    ]),

    PrismaModule,
    EmailModule,
    AuthModule,
    PetsModule,
    PublicModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
