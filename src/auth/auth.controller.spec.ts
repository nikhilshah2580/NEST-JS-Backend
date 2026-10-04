import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  const authService = { signup: jest.fn(), login: jest.fn() };
  let controller: AuthController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delegates signup to the authentication service', () => {
    const dto = { email: 'person@example.com' } as never;
    controller.signup(dto);
    expect(authService.signup).toHaveBeenCalledWith(dto);
  });

  it('delegates login to the authentication service', () => {
    const dto = { email: 'person@example.com' } as never;
    controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
