import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  // Normalize email to match the value stored during signup.
  @IsEmail()
  @MaxLength(150)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  // Bound password size before it reaches the identity provider.
  @IsString()
  @MaxLength(128)
  password: string;
}
