import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionService } from './create-transaction.service';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { Transaction } from 'src/domain/entities/transaction';
import { CreateDepositStrategy } from 'src/domain/strategies/create-transaction/create-deposit.strategy';
import { CreateCancelStrategy } from 'src/domain/strategies/create-transaction/create-cancel.strategy';
import { CreatePurchaseStrategy } from 'src/domain/strategies/create-transaction/create-purchase.strategy';
import { CreateReversalStrategy } from 'src/domain/strategies/create-transaction/create-reversal.strategy';
import { CreateWithdrawStrategy } from 'src/domain/strategies/create-transaction/create-withdraw.strategy';
import { RmqRecordBuilder } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

describe('CreateTransactionService', () => {
  let createTransactionService: CreateTransactionService,
    findByOriginId: jest.Func,
    emit: jest.Func,
    create: jest.Func,
    execute: jest.Func;

  const ORIGIN_ID = 'someid';

  const TRANSACTION: Transaction = {
    id: 'sooomeid',
    createdAt: new Date(),
  } as Transaction;

  beforeEach(async () => {
    emit = jest.fn(() => null);
    create = jest.fn((data) => new Transaction({ ...data, ...TRANSACTION }));
    execute = jest.fn((data) => data);
    findByOriginId = jest.fn((originId) =>
      originId === ORIGIN_ID ? {} : null,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionService,
        {
          provide: 'rabbitmq_module',
          useValue: {
            emit,
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            create,
            findByOriginId,
          },
        },
        {
          provide: CreateDepositStrategy,
          useValue: {
            execute,
          },
        },
        {
          provide: CreateCancelStrategy,
          useValue: {
            execute,
          },
        },
        {
          provide: CreatePurchaseStrategy,
          useValue: {
            execute,
          },
        },
        {
          provide: CreateReversalStrategy,
          useValue: {
            execute,
          },
        },
        {
          provide: CreateWithdrawStrategy,
          useValue: {
            execute,
          },
        },
      ],
    }).compile();

    createTransactionService = module.get<CreateTransactionService>(
      CreateTransactionService,
    );
  });

  for (const transactionOperation of Object.values(TransactionOperation)) {
    it('Should pass a valid create transaction payload and return transaction created', async () => {
      const data: CreateTransactionDTO = {
        amount: 2000,
        operation: transactionOperation,
        originId: 'otherid',
        parentTransactionId: null,
        userId: 'someid',
      };

      const response = await createTransactionService.execute(data);

      expect(response).toEqual(new Transaction({ ...data, ...TRANSACTION }));
      expect(findByOriginId).toHaveBeenCalledWith(data.originId);
      expect(execute).toHaveBeenCalledWith(data);
      expect(create).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith(
        'transaction_created',
        new RmqRecordBuilder({
          userId: data.userId,
          transactionId: TRANSACTION.id,
          operation: data.operation,
          amount: data.amount,
        }).build(),
      );
    });
  }

  it('Should pass an invalid originId and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.DEPOSIT,
      originId: ORIGIN_ID,
      parentTransactionId: null,
      userId: 'someid',
    };

    try {
      await createTransactionService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByOriginId).toHaveBeenCalledWith(data.originId);
    expect(execute).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('Should pass an invalid operation and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: 'strangeoperation' as TransactionOperation,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'someid',
    };

    try {
      await createTransactionService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByOriginId).toHaveBeenCalledWith(data.originId);
    expect(execute).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});
