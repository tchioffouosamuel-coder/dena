import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

// Valide le token JWT présenté sur chaque requête protégée et recharge
// l'utilisateur depuis la base (pour être sûr de son rôle à jour).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET', 'change_this_to_a_long_random_string');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Utilisateur introuvable ou accès révoqué');
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }
}
