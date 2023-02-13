import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AppSecretHeader = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-api-secret-key'];
  },
);
