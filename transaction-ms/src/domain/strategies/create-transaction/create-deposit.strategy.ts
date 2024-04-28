import { CreateTransactionStrategy } from 'src/app/services/transaction/create-transaction.service';
import { Transaction } from 'src/domain/entities/transaction';
import { CreateTransactionDTO } from 'src/interface/transaction/dtos';

export class CreateDepositStrategy implements CreateTransactionStrategy {
  execute(data: CreateTransactionDTO): Transaction {
    return new Transaction({
      ...data,
      createdAt: new Date(),
      parentTransactionId: null,
    });
  }
}
