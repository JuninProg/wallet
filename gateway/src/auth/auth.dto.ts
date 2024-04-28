import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDTO {
  @ApiProperty({
    example: 'José',
    description: 'User name',
    type: 'string',
    required: true,
  })
  name: string;
  @ApiProperty({
    example: 'jose@mail.com',
    description: 'User email',
    type: 'email',
    required: true,
  })
  email: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
    description: 'User password, must have 8 characters',
    type: 'string',
    required: true,
  })
  password: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
    description: 'Confirm user password',
    type: 'string',
    required: true,
  })
  confirmPassword: string;
}

export class SignInRequestDTO {
  @ApiProperty({
    example: 'jose@mail.com',
    description: 'User email',
    type: 'string',
    required: true,
  })
  email: string;
  @ApiProperty({
    example: '12345678',
    minLength: 8,
    description: 'User password, must have 8 characters',
    type: 'string',
    required: true,
  })
  password: string;
}
