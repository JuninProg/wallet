import { Test, TestingModule } from '@nestjs/testing';
import { GetStatementsService } from './get-statements.service';
import { StatementRepository } from 'src/infra/database/repositories/statement-repository';
import { GetStatementsDTO } from 'src/interface/statement/dtos';

describe('GetStatementsService', () => {
  let getStatementsService: GetStatementsService, findPaginated: jest.Func;

  const STATEMENTS = [
    {
      userId: 'someid',
    },
    {
      userId: 'otherid',
    },
  ];

  beforeEach(async () => {
    findPaginated = jest.fn((where) => ({
      items: STATEMENTS.filter((user) => user.userId === where.userId),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatementsService,
        {
          provide: StatementRepository,
          useValue: {
            findPaginated,
          },
        },
      ],
    }).compile();

    getStatementsService =
      module.get<GetStatementsService>(GetStatementsService);
  });

  it('Should return all user statements', async () => {
    const data: GetStatementsDTO = {
      userId: 'someid',
    };

    const response = await getStatementsService.execute(data);

    expect(response.items.length).toBe(1);
    expect(findPaginated).toHaveBeenCalled();
  });
});
