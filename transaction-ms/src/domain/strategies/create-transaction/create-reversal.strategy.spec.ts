import { Test, TestingModule } from '@nestjs/testing';
import { CreateReversalStrategy } from './create-reversal.strategy';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';
import { HttpException } from '@nestjs/common';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';

describe('CreateReversalStrategy', () => {
  let createReversalStrategy: CreateReversalStrategy, findById: jest.Func;

  const PARENT_TRANSACTION_ID = 'someid';

  beforeEach(async () => {
    findById = jest.fn((id) =>
      id === PARENT_TRANSACTION_ID
        ? { operation: TransactionOperation.PURCHASE }
        : null,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReversalStrategy,
        {
          provide: TransactionRepository,
          useValue: {
            findById,
          },
        },
      ],
    }).compile();

    createReversalStrategy = module.get<CreateReversalStrategy>(
      CreateReversalStrategy,
    );
  });

  it('Should pass a valid create reversal payload and return transaction', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.REVERSAL,
      originId: 'otherid',
      parentTransactionId: PARENT_TRANSACTION_ID,
      userId: 'someid',
    };

    const response = await createReversalStrategy.execute(data);

    expect(response).toBeInstanceOf(Transaction);
  });

  it('Should pass an inexistent parentTransactionId and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.REVERSAL,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'otherid',
    };

    try {
      await createReversalStrategy.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
