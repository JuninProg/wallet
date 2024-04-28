import {
  Body,
  Controller,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTransactionRequestDTO } from './transaction.dto';

@ApiTags('Transaction MS')
@Controller('transaction')
export class TransactionController {
  constructor(@Inject('TRANSACTION_MS') private client: ClientProxy) {}

  @Post()
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateTransactionRequestDTO })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async signUp(
    @Body() body: CreateTransactionRequestDTO,
    @Req() request: Request & { user: { id: string } },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { data, status, error } = await firstValueFrom(
      this.client.send(
        { cmd: 'create_transaction' },
        { ...body, userId: request.user.id },
      ),
    );

    response.status(status);

    return {
      data,
      error,
    };
  }
}
