import { TransactionOperation } from '../enum/transaction-operation.enum';

interface TransactionProps {
  id?: string;
  userId: string;
  operation: TransactionOperation;
  amount: number;
  originId: string;
  parentTransactionId?: string;
  parentTransaction?: Transaction;
  createdAt: Date;
}

export class Transaction {
  id?: string;

  userId: string;
  operation: TransactionOperation;
  amount: number;
  originId: string;
  parentTransactionId?: string;
  parentTransaction?: Transaction;

  createdAt: Date;

  constructor(props: TransactionProps) {
    Object.assign(this, props);
  }
}
