import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpRequestDTO {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @IsOptional()
  public readonly name: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsString()
  @MinLength(8)
  public readonly confirmPassword: string;
}
