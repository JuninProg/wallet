import { Inject } from '@nestjs/common';
import { PrismaConnector } from '../prisma';
import { Statement } from 'src/domain/entities/statement';

export interface PaginatedResult {
  items: Statement[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = { page?: number; perPage?: number };

export type PaginateWhere = {
  userId: string;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
};

export class StatementRepository {
  @Inject(PrismaConnector)
  private readonly db: PrismaConnector;

  async create(statement: Statement): Promise<Statement> {
    const statementCreated = await this.db.statement.create({
      data: statement,
    });

    return new Statement(statementCreated);
  }

  async findPaginated(
    where: PaginateWhere,
    opts: PaginateOptions,
  ): Promise<PaginatedResult> {
    const page = opts.page || 1;
    const perPage = opts.perPage || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, items] = await Promise.all([
      this.db.statement.count({ where }),
      this.db.statement.findMany({
        where,
        take: perPage,
        skip,
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      items,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  }
}
