import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY não configurada — e-mails serão simulados (apenas logados).');
      this.resend = null;
    } else {
      this.resend = new Resend(apiKey);
    }
    this.from = this.config.get<string>('EMAIL_FROM', 'no-reply@localhost');
    this.frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  async sendEmailConfirmation(to: string, name: string, token: string) {
    const url = `${this.frontendUrl}/confirmar-email?token=${token}`;

    await this.send({
      to,
      subject: 'Confirme seu e-mail',
      html: `
        <p>Olá, ${escapeHtml(name)}!</p>
        <p>Confirme seu e-mail para começar a usar a plataforma:</p>
        <p><a href="${url}">Confirmar meu e-mail</a></p>
        <p>Se você não criou essa conta, ignore esta mensagem.</p>
      `,
    });
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    const url = `${this.frontendUrl}/redefinir-senha?token=${token}`;

    await this.send({
      to,
      subject: 'Redefinição de senha',
      html: `
        <p>Olá, ${escapeHtml(name)}!</p>
        <p>Recebemos um pedido para redefinir sua senha. Este link expira em 1 hora.</p>
        <p><a href="${url}">Redefinir minha senha</a></p>
        <p>Se você não pediu isso, ignore esta mensagem — sua senha continua a mesma.</p>
      `,
    });
  }

  private async send(params: { to: string; subject: string; html: string }) {
    if (this.resend === null) {
      this.logger.log(`[e-mail simulado] Para: ${params.to} | Assunto: ${params.subject}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
    } catch (error) {
      // Falha no envio de e-mail nunca deve derrubar a request nem expor detalhes ao usuário;
      // logamos para investigação e o fluxo de auth trata isso de forma genérica.
      this.logger.error(`Falha ao enviar e-mail para ${params.to}`, error as Error);
      throw error;
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
