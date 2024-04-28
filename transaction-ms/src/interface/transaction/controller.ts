import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDTO } from './dtos';
import { CreateTransactionService } from 'src/app/services/transaction/create-transaction.service';

@Controller()
export class TransactionController {
  @Inject(CreateTransactionService)
  private readonly createTransactionService: CreateTransactionService;

  @MessagePattern({ cmd: 'create_transaction' })
  async signUp(payload: CreateTransactionDTO) {
    const response = await this.createTransactionService.execute(payload);

    return {
      status: HttpStatus.CREATED,
      data: response,
    };
  }
}
