import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Uso: @UseGuards(JwtAuthGuard) em qualquer rota que exige usuário logado
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
