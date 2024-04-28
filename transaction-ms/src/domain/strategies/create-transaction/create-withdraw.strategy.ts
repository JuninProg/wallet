import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { GetBalanceService } from 'src/app/services/balance/get-balance.service';
import { CreateTransactionStrategy } from 'src/app/services/transaction/create-transaction.service';
import { Transaction } from 'src/domain/entities/transaction';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';

export class CreateWithdrawStrategy implements CreateTransactionStrategy {
  @Inject(GetBalanceService)
  private readonly getBalanceService: GetBalanceService;

  async execute(data: CreateTransactionDTO) {
    const balance = await this.getBalanceService.execute(data.userId);

    if (balance - data.amount < 0)
      throw new HttpException(
        'Insufficient balance for WITHDRAW',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return new Transaction({
      ...data,
      createdAt: new Date(),
      parentTransactionId: null,
    });
  }
}
