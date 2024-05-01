import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Statement } from 'src/domain/entities/statement';
import { StatementRepository } from 'src/infra/database/repositories/statement-repository';
import { CreateStatementDTO } from 'src/interface/statement/dtos';

@Injectable()
export class CreateStatementService {
  @Inject(StatementRepository)
  private readonly repository: StatementRepository;
  @Inject('TRANSACTION_MS')
  private readonly transactionClient: ClientProxy;

  async execute(payload: CreateStatementDTO) {
    const { data, error } = await firstValueFrom(
      this.transactionClient.send(
        { cmd: 'get_balance' },
        { userId: payload.userId },
      ),
    );

    if (error)
      throw new HttpException(
        'Failed to request balance',
        HttpStatus.SERVICE_UNAVAILABLE,
      );

    const statement = new Statement({
      ...payload,
      balance: data,
      createdAt: new Date(),
    });

    return this.repository.create(statement);
  }
}
