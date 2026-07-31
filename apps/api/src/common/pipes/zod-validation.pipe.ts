import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

// Uso: @UsePipes(new ZodValidationPipe(registerSchema))
// Garante que TODO input do usuário é validado antes de chegar ao service.
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      // Nunca expor detalhes internos do erro — só os campos e mensagens de validação
      const issues = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestException({ message: 'Dados inválidos', issues });
    }

    return result.data;
  }
}
