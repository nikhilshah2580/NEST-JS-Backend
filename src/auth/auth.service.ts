import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,

    private readonly usersService: UsersService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(signupDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const { data, error } = await this.supabase.auth.signUp({
      email: signupDto.email,
      password: signupDto.password,
      options: {
        data: {
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
          phone: signupDto.phone,
        },
      },
    });

    if (error) {
      // Do not forward identity-provider errors: they may disclose whether an
      // account already exists or details of the configured auth policy.
      this.logger.warn(
        `Supabase signup rejected: code=${error.code ?? 'unknown'} status=${error.status ?? 'unknown'} message=${error.message}`,
      );

      console.error('Supabase signup error:', error);
      throw new BadRequestException('Unable to register with these credentials');
    }

    if (!data.user) {
      throw new BadRequestException('Unable to create Supabase user');
    }

    const user = await this.usersService.createFromSupabase({
      supabaseUserId: data.user.id,
      email: data.user.email ?? signupDto.email,
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      phone: signupDto.phone,
      role: UserRole.USER,
    });

    return {
      message: 'User registered successfully',
      user,
      session: data.session,
    };
  }

  async login(loginDto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error) {
      // The same response for an unknown account and a wrong password prevents
      // credential stuffing tools from using this endpoint for user discovery.
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = await this.usersService.findBySupabaseUserId(data.user.id);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user,
      session: data.session,
    };
  }
}
