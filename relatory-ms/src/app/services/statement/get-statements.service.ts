import { Inject, Injectable } from '@nestjs/common';
import { StatementRepository } from 'src/infra/database/repositories/statement-repository';
import { GetStatementsDTO } from 'src/interface/statement/dtos';

@Injectable()
export class GetStatementsService {
  @Inject(StatementRepository)
  private readonly repository: StatementRepository;

  execute(payload: GetStatementsDTO) {
    return this.repository.getAll(payload.userId);
  }
}
