import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaConnector } from 'src/infra/database/prisma';
import { TransactionController } from 'src/interface/transaction/controller';
import { CreateTransactionService } from '../services/transaction/create-transaction.service';
import { TransactionRepository } from 'src/infra/database/repositories/transaction-repository';

@Module({
  imports: [ConfigModule],
  controllers: [TransactionController],
  providers: [CreateTransactionService, TransactionRepository, PrismaConnector],
})
export class TransactionModule {}
