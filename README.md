# Plataforma de Proteção Animal — Monorepo

## Estrutura

```
pets-platform/
├── apps/
│   ├── api/     # Backend NestJS + Prisma + PostgreSQL
│   └── web/     # Frontend Next.js (placeholder — Etapa 6)
├── package.json # workspaces raiz
```

## Etapa atual: Fundação (Auth + Banco de Dados)

Esta etapa entrega:
- Schema completo do Prisma (usuários, pets, histórico médico, vacinas, QR codes, sessões, tokens)
- Esqueleto do módulo de autenticação em NestJS (estrutura, DTOs, guards, validação)
- Configuração de segurança base (Helmet, CORS, cookies, rate limiting)

A lógica completa de cada endpoint de autenticação (registro, confirmação de e-mail,
login, refresh, esqueci senha) será implementada na próxima etapa, para manter os
commits pequenos e revisáveis.

## Como rodar (quando os pacotes forem instalados)

```bash
# na raiz
npm install

# configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# editar apps/api/.env com sua DATABASE_URL, JWT_SECRET, etc.

# gerar client do Prisma e rodar migration inicial
npm run prisma:generate
npm run prisma:migrate

# subir a API em modo dev
npm run dev:api
```

## Próximos passos (Etapa 2)
- Implementar lógica de registro + envio de e-mail de confirmação (Resend)
- Implementar login com JWT (access + refresh token rotativo)
- Implementar fluxo de "esqueci minha senha"
- Testes unitários do módulo de auth
