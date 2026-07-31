import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger detalhado apenas em dev; em produção usar um logger estruturado (ex: pino)
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Cabeçalhos de segurança (protege contra clickjacking, sniffing, etc.)
  app.use(helmet());

  // Necessário para ler o refresh token do cookie HttpOnly
  app.use(cookieParser());

  // CORS restrito ao domínio do frontend — nunca usar '*' com credentials
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // Prefixo global da API (facilita versionamento futuro: /api/v1)
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API rodando em http://localhost:${port}/api/v1`);
}

bootstrap();
