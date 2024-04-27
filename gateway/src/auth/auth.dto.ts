import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDTO {
  @ApiProperty({
    example: 'José',
  })
  name: string;
  @ApiProperty({
    example: 'jose@mail.com',
  })
  email: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
  })
  password: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
  })
  confirmPassword: string;
}

export class SignInRequestDTO {
  @ApiProperty({
    example: 'jose@mail.com',
  })
  email: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
  })
  password: string;
}
