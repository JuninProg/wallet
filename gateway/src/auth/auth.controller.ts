import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { SignInRequestDTO, SignUpRequestDTO } from './auth.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Authentication MS')
@Controller()
export class AuthController {
  constructor(@Inject('AUTH_MS') private client: ClientProxy) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpRequestDTO })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async signUp(
    @Body() body: SignUpRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'sign_up' }, body),
    );

    if (data) response.cookie('token', data.token);

    response.status(status);

    return {
      data,
      error,
    };
  }

  @Post('sign-in')
  @ApiBody({ type: SignInRequestDTO })
  @ApiResponse({ status: 201, description: 'User signed in' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async signIn(
    @Body() body: SignInRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'sign_in' }, body),
    );

    if (data) response.cookie('token', data.token);

    response.status(status);

    return {
      data,
      error,
    };
  }

  @Get('user')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 400, description: 'Invalid params' })
  async getUser(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request & { user: { id: string } },
  ) {
    const userId = request.user.id;

    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'get_user' }, { id: userId }),
    );

    response.status(status);

    return {
      data,
      error,
    };
  }
}
