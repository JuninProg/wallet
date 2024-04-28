import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateTransactionStrategy } from 'src/app/services/transaction/create-transaction.service';
import { Transaction } from 'src/domain/entities/transaction';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';

export class CreateReversalStrategy implements CreateTransactionStrategy {
  @Inject(TransactionRepository)
  private readonly repository: TransactionRepository;

  async execute(data: CreateTransactionDTO) {
    const parentTransactionFound = await this.repository.findById(
      data.parentTransactionId,
    );

    if (
      !parentTransactionFound ||
      parentTransactionFound.operation !== TransactionOperation.PURCHASE
    )
      throw new HttpException(
        'Transaction not found by parentTransactionId or operation is not PURCHASE',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return new Transaction({ ...data, createdAt: new Date() });
  }
}
