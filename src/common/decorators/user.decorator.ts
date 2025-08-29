import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';

/**
 * Custom decorator to extract user information from JWT token.
 *
 * Usage:
 * - @User() user: JwtPayload - Get the full user object
 * - @User('sub') userId: string - Get just the user ID
 * - @User('email') email: string - Get just the email
 * - @User('role') role: string - Get just the role
 */
export const User = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new Error(
        'User not found in request. Make sure JwtAuthGuard is applied.',
      );
    }

    return data ? user[data] : user;
  },
);
