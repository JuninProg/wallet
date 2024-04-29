import { Test, TestingModule } from '@nestjs/testing';
import { GetBalanceService } from './get-balance.service';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { GetBalanceDTO } from 'src/interface/transaction/dtos';

describe('GetBalanceService', () => {
  let getBalanceService: GetBalanceService,
    findUserTransactionsWithParent: jest.Func;

  const TRANSACTIONS = [
    {
      operation: TransactionOperation.DEPOSIT,
      amount: 2000,
    },
    {
      operation: TransactionOperation.WITHDRAW,
      amount: 1000,
    },
    {
      operation: TransactionOperation.PURCHASE,
      amount: 500,
    },
    {
      operation: TransactionOperation.REVERSAL,
      amount: 500,
    },
    {
      operation: TransactionOperation.CANCEL,
      amount: 500,
      parentTransaction: {
        operation: TransactionOperation.REVERSAL,
      },
    },
    {
      operation: TransactionOperation.PURCHASE,
      amount: 500,
    },
    {
      operation: TransactionOperation.CANCEL,
      amount: 500,
      parentTransaction: {
        operation: TransactionOperation.PURCHASE,
      },
    },
  ];

  beforeEach(async () => {
    findUserTransactionsWithParent = jest.fn(() => TRANSACTIONS);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBalanceService,
        {
          provide: TransactionRepository,
          useValue: {
            findUserTransactionsWithParent,
          },
        },
      ],
    }).compile();

    getBalanceService = module.get<GetBalanceService>(GetBalanceService);
  });

  it('Should pass a valid userId and return current balance', async () => {
    const data: GetBalanceDTO = {
      userId: 'someid',
    };

    const response = await getBalanceService.execute(data.userId);

    expect(response).toBe(500);
  });
});
