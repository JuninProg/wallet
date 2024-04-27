import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDTO {
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
