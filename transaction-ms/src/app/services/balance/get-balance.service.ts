import { Inject, Injectable } from '@nestjs/common';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';

@Injectable()
export class GetBalanceService {
  @Inject(TransactionRepository)
  private readonly repository: TransactionRepository;

  async execute(userId: string): Promise<number> {
    const transactions =
      await this.repository.findUserTransactionsWithParent(userId);

    const sums = {
      deposit: 0,
      withdraw: 0,
      reversal: 0,
      purchase: 0,
      cancel_purchase: 0,
      cancel_reversal: 0,
    };

    for (const transaction of transactions) {
      const key =
        transaction.operation === TransactionOperation.CANCEL
          ? `${transaction.operation}_${transaction.parentTransaction?.operation}`
          : transaction.operation;
      sums[key] += transaction.amount;
    }

    const positiveBalance =
      sums['deposit'] + sums['reversal'] + sums['cancel_purchase'];
    const negativeBalance =
      sums['withdraw'] + sums['purchase'] + sums['cancel_reversal'];

    return positiveBalance - negativeBalance;
  }
}
