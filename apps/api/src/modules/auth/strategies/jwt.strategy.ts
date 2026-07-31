import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // userId
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // access token vem no header Authorization: Bearer <token>
      // (o refresh token, sim, vai em cookie HttpOnly — nunca aqui)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  // O retorno aqui é injetado em request.user pelos controllers protegidos
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
