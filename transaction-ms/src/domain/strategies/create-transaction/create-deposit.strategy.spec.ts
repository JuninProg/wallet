import { Test, TestingModule } from '@nestjs/testing';
import { CreateDepositStrategy } from './create-deposit.strategy';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';
import { Transaction } from 'src/domain/entities/transaction';

describe('CreateDepositStrategy', () => {
  let createDepositStrategy: CreateDepositStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateDepositStrategy],
    }).compile();

    createDepositStrategy = module.get<CreateDepositStrategy>(
      CreateDepositStrategy,
    );
  });

  it('Should pass a valid create deposit payload and return transaction', () => {
    const data: CreateTransactionDTO = {
      amount: 2000,
      operation: TransactionOperation.DEPOSIT,
      originId: 'otherid',
      parentTransactionId: null,
      userId: 'someid',
    };

    const response = createDepositStrategy.execute(data);

    expect(response).toBeInstanceOf(Transaction);
  });
});
