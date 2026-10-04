import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
// Apply rate limiting to every public authentication endpoint.
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signup: creates a Supabase account and its local application profile.
  @Post('signup')
  @Throttle({ auth: { limit: 3, ttl: 60_000, blockDuration: 15 * 60_000 } })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  // Login: verifies credentials and returns the Supabase session.
  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 60_000, blockDuration: 15 * 60_000 } })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
