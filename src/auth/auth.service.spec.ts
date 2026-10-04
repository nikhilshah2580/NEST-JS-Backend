import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  const supabase = {
    auth: { signUp: jest.fn(), signInWithPassword: jest.fn() },
  };
  const usersService = {
    findByEmail: jest.fn(),
    createFromSupabase: jest.fn(),
    findBySupabaseUserId: jest.fn(),
  };
  let service: AuthService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'SUPABASE_CLIENT', useValue: supabase },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('creates a local profile only after Supabase creates the account', async () => {
    const profile = { id: 1, email: 'person@example.com' };
    usersService.findByEmail.mockResolvedValue(null);
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: 'auth-id', email: 'person@example.com' }, session: null },
      error: null,
    });
    usersService.createFromSupabase.mockResolvedValue(profile);

    await expect(
      service.signup({
        email: 'person@example.com',
        password: 'Correct-Horse-Battery1!',
        firstName: 'Person',
        lastName: 'Example',
      }),
    ).resolves.toEqual({
      message: 'User registered successfully',
      user: profile,
      session: null,
    });
    expect(usersService.createFromSupabase).toHaveBeenCalledWith(
      expect.objectContaining({ supabaseUserId: 'auth-id', role: 'user' }),
    );
  });

  it('rejects duplicate local accounts before calling Supabase', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.signup({
        email: 'person@example.com',
        password: 'Correct-Horse-Battery1!',
        firstName: 'Person',
        lastName: 'Example',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('does not reveal provider signup errors', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    supabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: new Error('email already registered'),
    });

    await expect(
      service.signup({
        email: 'person@example.com',
        password: 'Correct-Horse-Battery1!',
        firstName: 'Person',
        lastName: 'Example',
      }),
    ).rejects.toEqual(
      new BadRequestException('Unable to register with these credentials'),
    );
  });

  it('uses one response for invalid login credentials', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Invalid login credentials'),
    });

    await expect(
      service.login({ email: 'person@example.com', password: 'wrong-password' }),
    ).rejects.toEqual(new UnauthorizedException('Invalid email or password'));
  });

  it('returns a session for an active account with a profile', async () => {
    const profile = { id: 1, isActive: true };
    const session = { access_token: 'token' };
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'auth-id' }, session },
      error: null,
    });
    usersService.findBySupabaseUserId.mockResolvedValue(profile);

    await expect(
      service.login({
        email: 'person@example.com',
        password: 'Correct-Horse-Battery1!',
      }),
    ).resolves.toEqual({ message: 'Login successful', user: profile, session });
  });
});
