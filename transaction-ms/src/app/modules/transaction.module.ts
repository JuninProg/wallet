import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaConnector } from 'src/infra/database/prisma';
import { TransactionController } from 'src/interface/transaction/controller';
import { CreateTransactionService } from '../services/transaction/create-transaction.service';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';
import { CreateDepositStrategy } from 'src/domain/strategies/create-transaction/create-deposit.strategy';
import { GetBalanceService } from '../services/balance/get-balance.service';
import { CreateWithdrawStrategy } from 'src/domain/strategies/create-transaction/create-withdraw.strategy';
import { CreatePurchaseStrategy } from 'src/domain/strategies/create-transaction/create-purchase.strategy';
import { CreateReversalStrategy } from 'src/domain/strategies/create-transaction/create-reversal.strategy';
import { CreateCancelStrategy } from 'src/domain/strategies/create-transaction/create-cancel.strategy';

@Module({
  imports: [ConfigModule],
  controllers: [TransactionController],
  providers: [
    GetBalanceService,
    CreatePurchaseStrategy,
    CreateReversalStrategy,
    CreateCancelStrategy,
    CreateWithdrawStrategy,
    CreateDepositStrategy,
    CreateTransactionService,
    TransactionRepository,
    PrismaConnector,
  ],
})
export class TransactionModule {}
