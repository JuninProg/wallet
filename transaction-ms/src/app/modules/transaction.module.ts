import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'rabbitmq_module',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmqUrl')],
            queue: configService.get<string>('rabbitmqRelatoryQueue'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
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
