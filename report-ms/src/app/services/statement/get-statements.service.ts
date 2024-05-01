import { Inject, Injectable } from '@nestjs/common';
import {
  PaginateWhere,
  StatementRepository,
} from 'src/infra/database/repositories/statement-repository';
import { GetStatementsDTO } from 'src/interface/statement/dtos';

@Injectable()
export class GetStatementsService {
  @Inject(StatementRepository)
  private readonly repository: StatementRepository;

  execute(payload: GetStatementsDTO) {
    const where: PaginateWhere = {
      userId: payload.userId,
      createdAt: {},
    };

    if (payload.startDate)
      where.createdAt.gte = new Date(Date.parse(payload.startDate));
    if (payload.endDate)
      where.createdAt.lte = new Date(Date.parse(payload.endDate));

    return this.repository.findPaginated(where, {
      page: Number(payload.page),
      perPage: Number(payload.perPage),
    });
  }
}
