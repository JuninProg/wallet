import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
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

export class SignInDTO {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;
}

export class VerifyTokenDTO {
  @IsString()
  @IsNotEmpty()
  public readonly token: string;
}
