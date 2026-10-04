import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Provides the authenticated local user set by SupabaseAuthGuard.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
