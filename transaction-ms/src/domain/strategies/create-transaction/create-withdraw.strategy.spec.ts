import { Test, TestingModule } from '@nestjs/testing';
import { CreateWithdrawStrategy } from './create-withdraw.strategy';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';
import { GetBalanceService } from 'src/app/services/balance/get-balance.service';
import { HttpException } from '@nestjs/common';

describe('CreateWithdrawStrategy', () => {
  let createWithdrawStrategy: CreateWithdrawStrategy, execute: jest.Func;

  const USER_ID = 'someid';

  beforeEach(async () => {
    execute = jest.fn((userId) => (userId === USER_ID ? 2000 : 0));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWithdrawStrategy,
        {
          provide: GetBalanceService,
          useValue: {
            execute,
          },
        },
      ],
    }).compile();

    createWithdrawStrategy = module.get<CreateWithdrawStrategy>(
      CreateWithdrawStrategy,
    );
  });

  it('Should pass a valid create withdraw payload and return transaction', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.WITHDRAW,
      originId: 'otherid',
      parentTransactionId: null,
      userId: USER_ID,
    };

    const response = await createWithdrawStrategy.execute(data);

    expect(response).toBeInstanceOf(Transaction);
  });

  it('Should pass an user without balance for withdraw and throw exception', async () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.WITHDRAW,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'otherid',
    };

    try {
      await createWithdrawStrategy.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
