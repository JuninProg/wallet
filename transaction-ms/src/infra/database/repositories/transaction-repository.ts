import { Inject } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import { Transaction } from 'src/domain/entities/transaction';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Operation } from '@prisma/client';

export class TransactionRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(
    transaction: Omit<Transaction, 'parentTransaction'>,
  ): Promise<Transaction> {
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

  async findByOriginId(originId: string): Promise<Transaction | null> {
    const transaction = await this.db.transaction.findFirst({
      where: { originId },
    });

    if (!transaction) return null;

    return new Transaction({
      ...transaction,
      operation: TransactionOperation[transaction.operation.toUpperCase()],
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.db.transaction.findFirst({
      where: { id },
    });

    if (!transaction) return null;

    return new Transaction({
      ...transaction,
      operation: TransactionOperation[transaction.operation.toUpperCase()],
    });
  }

  async findUserTransactionsWithParent(userId: string) {
    const transactions = await this.db.transaction.findMany({
      where: {
        userId: userId,
      },
      include: {
        parentTransaction: true,
      },
    });
    return transactions.map(
      (transaction) =>
        new Transaction({
          ...transaction,
          operation: TransactionOperation[transaction.operation.toUpperCase()],
          parentTransaction: transaction.parentTransaction
            ? new Transaction({
                ...transaction.parentTransaction,
                operation:
                  TransactionOperation[
                    transaction.parentTransaction.operation.toUpperCase()
                  ],
              })
            : null,
        }),
    );
  }
}
