import { Test, TestingModule } from '@nestjs/testing';
import { CreatePurchaseStrategy } from './create-purchase.strategy';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';
import { GetBalanceService } from 'src/app/services/balance/get-balance.service';
import { HttpException } from '@nestjs/common';

describe('CreatePurchaseStrategy', () => {
  let createPurchaseStrategy: CreatePurchaseStrategy, execute: jest.Func;

  const USER_ID = 'someid';

  beforeEach(async () => {
    execute = jest.fn((userId) => (userId === USER_ID ? 2000 : 0));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePurchaseStrategy,
        {
          provide: GetBalanceService,
          useValue: {
            execute,
          },
        },
      ],
    }).compile();

    createPurchaseStrategy = module.get<CreatePurchaseStrategy>(
      CreatePurchaseStrategy,
    );
  });

  it('Should pass a valid create purchase payload and return transaction', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.PURCHASE,
      originId: 'otherid',
      parentTransactionId: null,
      userId: USER_ID,
    };

    const response = await createPurchaseStrategy.execute(data);

    expect(response).toBeInstanceOf(Transaction);
  });

  it('Should pass an user without balance for purchase and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.PURCHASE,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'otherid',
    };

    try {
      await createPurchaseStrategy.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
