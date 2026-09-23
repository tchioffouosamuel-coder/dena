import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Récupère l'utilisateur authentifié injecté par JwtStrategy (request.user)
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
