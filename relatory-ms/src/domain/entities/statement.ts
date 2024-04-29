interface StatementProps {
  id?: string;
  userId: string;
  transactionId: string;
  operation: string;
  amount: number;
  balance: number;
  createdAt: Date;
}

export class Statement {
  id?: string;

  userId: string;
  transactionId: string;
  operation: string;
  amount: number;
  balance: number;

  createdAt: Date;

  constructor(props: StatementProps) {
    Object.assign(this, props);
  }
}
