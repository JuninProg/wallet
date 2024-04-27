import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { SignInRequestDTO, SignUpRequestDTO } from './auth.dto';

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

  @Post('sign-in')
  @ApiBody({ type: SignInRequestDTO })
  @ApiResponse({ status: 201, description: 'User signed in' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async signIn(
    @Body() body: SignInRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'sign_in' }, body),
    );

    if (data) response.cookie('token', data.token);

    response.status(status);
    response.json({ data, status, error });
  }

  @Get('user/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '8fa7a50b-88d5-4cfa-b17e-1c94b1eaf664',
  })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 400, description: 'Invalid params' })
  async getUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'get_user' }, { id }),
    );

    response.status(status);
    response.json({ data, status, error });
  }
}
