import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { SignUpRequestDTO } from './auth.dto';

@ApiTags('Authentication MS')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_MS') private client: ClientProxy) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpRequestDTO })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async signUp(
    @Body() body: SignUpRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'sign_up' }, body),
    );

    if (data) response.cookie('token', data.token);

    response.status(status);
    response.json({ data, status, error });
  }
}
