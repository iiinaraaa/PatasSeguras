# 🐾 Patas Seguras

> Plataforma gratuita de proteção animal — ajudando tutores, ONGs e protetores independentes a cuidar, identificar e reencontrar animais.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

---

## Sobre o projeto

Todo pet merece um caminho de volta para casa. O **Patas Seguras** permite que qualquer tutor cadastre seus animais gratuitamente, gere um **QR Code exclusivo** para a coleira, e mantenha um perfil público seguro — sem nunca expor dados sensíveis como endereço ou documentos.

Se o pet se perder, qualquer pessoa que o encontrar pode escanear o QR Code e acessar imediatamente um contato de WhatsApp, informações médicas relevantes e a cidade do tutor.

## Funcionalidades

-  **Autenticação seguindo boas práticas de segurança** — senhas com Argon2, tokens JWT rotativos, confirmação de e-mail, recuperação de senha
-  **Cadastro completo de pets** — dados médicos, vacinas, alergias, contato
-  **QR Code único por pet** — nunca armazena dados do animal, só um identificador opaco
-  **Página pública configurável** — o tutor escolhe exatamente o que fica visível
-  **100% responsivo**, pensado para uso no celular

##  Tecnologias

| Camada | Stack |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL + Prisma ORM |
| E-mail transacional | Resend |
| Autenticação | JWT (access + refresh token rotativo), Argon2id |
