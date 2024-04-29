import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateTransactionDTO, GetBalanceDTO } from './dtos';
import { CreateTransactionService } from 'src/app/services/transaction/create-transaction.service';
import { GetBalanceService } from 'src/app/services/balance/get-balance.service';

@Controller()
export class TransactionController {
  @Inject(CreateTransactionService)
  private readonly createTransactionService: CreateTransactionService;

  @Inject(GetBalanceService)
  private readonly getBalanceService: GetBalanceService;

  @MessagePattern({ cmd: 'create_transaction' })
  async signUp(payload: CreateTransactionDTO) {
    const response = await this.createTransactionService.execute(payload);

    return {
      status: HttpStatus.CREATED,
      data: response,
    };
  }

  @MessagePattern({ cmd: 'get_balance' })
  async getBalance(data: GetBalanceDTO) {
    const response = await this.getBalanceService.execute(data.userId);

    return {
      status: HttpStatus.OK,
      data: response,
    };
  }

  @EventPattern('transaction_requested')
  async transactionRequested(
    @Payload() data: CreateTransactionDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`transaction_requested: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.createTransactionService.execute(data);
    } catch (error) {
      console.error(error);
    }

    channel.ack(message);
  }
}
