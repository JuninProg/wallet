import { Test, TestingModule } from '@nestjs/testing';
import { CreateCancelStrategy } from './create-cancel.strategy';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';
import { HttpException } from '@nestjs/common';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';

describe('CreateCancelStrategy', () => {
  let createCancelStrategy: CreateCancelStrategy, findById: jest.Func;

  const PARENT_TRANSACTION_ID = 'someid';

  beforeEach(async () => {
    findById = jest.fn((id) =>
      id === PARENT_TRANSACTION_ID
        ? { operation: TransactionOperation.REVERSAL }
        : null,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCancelStrategy,
        {
          provide: TransactionRepository,
          useValue: {
            findById,
          },
        },
      ],
    }).compile();

    createCancelStrategy =
      module.get<CreateCancelStrategy>(CreateCancelStrategy);
  });

  it('Should pass a valid create cancel payload and return transaction', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.CANCEL,
      originId: 'otherid',
      parentTransactionId: PARENT_TRANSACTION_ID,
      userId: 'someid',
    };

    const response = await createCancelStrategy.execute(data);

    expect(response).toBeInstanceOf(Transaction);
  });

  it('Should pass an inexistent parentTransactionId and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.CANCEL,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'otherid',
    };

    try {
      await createCancelStrategy.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
