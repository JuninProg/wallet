import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';
import { CreateDepositStrategy } from 'src/domain/strategies/create-transaction/create-deposit.strategy';
import { CreateWithdrawStrategy } from 'src/domain/strategies/create-transaction/create-withdraw.strategy';
import { CreatePurchaseStrategy } from 'src/domain/strategies/create-transaction/create-purchase.strategy';
import { CreateReversalStrategy } from 'src/domain/strategies/create-transaction/create-reversal.strategy';
import { CreateCancelStrategy } from 'src/domain/strategies/create-transaction/create-cancel.strategy';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

export interface CreateTransactionStrategy {
  execute(data: CreateTransactionDTO): Promise<Transaction> | Transaction;
}

@Injectable()
export class CreateTransactionService {
  @Inject('rabbitmq_module')
  private readonly amqpClient: ClientProxy;

  @Inject(TransactionRepository)
  private readonly repository: TransactionRepository;

  @Inject(CreateDepositStrategy)
  private readonly createDepositStrategy: CreateDepositStrategy;

  @Inject(CreateWithdrawStrategy)
  private readonly createWithdrawStrategy: CreateWithdrawStrategy;

  @Inject(CreatePurchaseStrategy)
  private readonly createPurchaseStrategy: CreatePurchaseStrategy;

  @Inject(CreateReversalStrategy)
  private readonly createReversalStrategy: CreateReversalStrategy;

  @Inject(CreateCancelStrategy)
  private readonly createCancelStrategy: CreateCancelStrategy;

  private setStrategy(
    operation: TransactionOperation,
  ): CreateTransactionStrategy {
    switch (operation) {
      case TransactionOperation.DEPOSIT:
        return this.createDepositStrategy;
      case TransactionOperation.WITHDRAW:
        return this.createWithdrawStrategy;
      case TransactionOperation.PURCHASE:
        return this.createPurchaseStrategy;
      case TransactionOperation.CANCEL:
        return this.createCancelStrategy;
      case TransactionOperation.REVERSAL:
        return this.createReversalStrategy;
      default:
        throw new HttpException(
          `Operation not implemented => ${operation}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
  }

  async execute(data: CreateTransactionDTO) {
    const transactionFoundByOrigin = await this.repository.findByOriginId(
      data.originId,
    );

    if (transactionFoundByOrigin)
      throw new HttpException(
        `Transaction already processed => ${data.originId}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const strategy = this.setStrategy(data.operation);

    const transaction = await strategy.execute(data);

    const transactionCreated = await this.repository.create(transaction);

    const message = new RmqRecordBuilder({
      userId: transactionCreated.userId,
      transactionId: transactionCreated.id,
      operation: transactionCreated.operation,
      amount: transactionCreated.amount,
    }).build();

    this.amqpClient.emit('transaction_created', message);

    return transactionCreated;
  }
}
