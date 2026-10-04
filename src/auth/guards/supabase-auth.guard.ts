import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { UsersService } from '../../users/users.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,

    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);

    if (!match) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const token = match[1];

    const {
      data: { user: supabaseUser },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.usersService.findBySupabaseUserId(supabaseUser.id);

    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    request.user = user;

    return true;
  }
}
