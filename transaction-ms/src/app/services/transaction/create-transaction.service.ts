import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';

@Injectable()
export class CreateTransactionService {
  @Inject(TransactionRepository)
  private readonly repository: TransactionRepository;

  execute(data: CreateTransactionDTO) {
    return this.repository.create({ ...data, createdAt: new Date() });
  }
}
