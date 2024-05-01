import { Inject } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import { Statement } from 'src/domain/entities/statement';

export class StatementRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(statement: Statement): Promise<Statement> {
    const statementCreated = await this.db.statement.create({
      data: statement,
    });

    return new Statement(statementCreated);
  }

  getAll(userId: string) {
    return this.db.statement.findMany({ where: { userId } });
  }
}
