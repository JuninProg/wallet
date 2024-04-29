import { Test, TestingModule } from '@nestjs/testing';
import { CreateStatementService } from './create-statement.service';
import { Statement } from 'src/domain/entities/statement';
import { StatementRepository } from 'src/infra/database/repositories/statement-repository';
import { of } from 'rxjs';
import { CreateStatementDTO } from 'src/interface/statement/dtos';
import { HttpException } from '@nestjs/common';

describe('CreateStatementService', () => {
  let createStatementService: CreateStatementService,
    send: jest.Func,
    create: jest.Func;

  const BALANCE = 1000;
  const USER_ID = 'someid';
  let STATEMENT: Statement = {
    id: 'someid',
    createdAt: new Date(),
  } as Statement;

  beforeEach(async () => {
    create = jest.fn((data) => {
      STATEMENT = new Statement({ ...data, ...STATEMENT });
      return STATEMENT;
    });
    send = jest.fn((_, { userId }) =>
      userId === USER_ID
        ? of({ data: BALANCE })
        : of({ error: { message: 'someerror' } }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStatementService,
        {
          provide: StatementRepository,
          useValue: {
            create,
          },
        },
        {
          provide: 'TRANSACTION_MS',
          useValue: {
            send,
          },
        },
      ],
    }).compile();

    createStatementService = module.get<CreateStatementService>(
      CreateStatementService,
    );
  });

  it('Should pass a valid create statement payload and return statement', async () => {
    const data: CreateStatementDTO = {
      userId: USER_ID,
      amount: 1000,
      operation: 'deposit',
      transactionId: '321dd7cb-2748-4706-b2b0-ba529152af3e',
    };

    const response = await createStatementService.execute(data);

    expect(response).toBe(STATEMENT);
    expect(send).toHaveBeenCalledWith(
      { cmd: 'get_balance' },
      { userId: data.userId },
    );
    expect(create).toHaveBeenCalled();
  });

  it('Should pass an invalid userId and throw exception when getting balance', async () => {
    const data: CreateStatementDTO = {
      userId: '7faff7d6-fda5-4e29-8ba6-e7fbf3e765c6',
      amount: 1000,
      operation: 'deposit',
      transactionId: '321dd7cb-2748-4706-b2b0-ba529152af3e',
    };

    try {
      await createStatementService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(send).toHaveBeenCalledWith(
      { cmd: 'get_balance' },
      { userId: data.userId },
    );
    expect(create).not.toHaveBeenCalled();
  });
});
