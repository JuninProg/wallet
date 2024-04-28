import { Inject } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import { Transaction } from 'src/domain/entities/transaction';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Operation } from '@prisma/client';

export class TransactionRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(transaction: Transaction): Promise<Transaction> {
    const transactionCreated = await this.db.transaction.create({
      data: {
        ...transaction,
        operation: Operation[transaction.operation.toUpperCase()],
      },
    });

    return new Transaction({
      ...transactionCreated,
      operation:
        TransactionOperation[transactionCreated.operation.toUpperCase()],
    });
  }
}
