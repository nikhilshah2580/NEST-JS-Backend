import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  // All fields are optional so clients can submit partial updates.
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  // Email remains validated and bounded before database storage.
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
