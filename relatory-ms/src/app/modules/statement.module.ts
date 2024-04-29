import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PrismaConnector } from 'src/infra/database/prisma';
import { StatementController } from 'src/interface/statement/controller';
import { CreateStatementService } from '../services/statement/create-statement.service';
import { StatementRepository } from 'src/infra/database/repositories/statement-repository';
import { GetStatementsService } from '../services/statement/get-statements.service';

@Module({
  imports: [ConfigModule],
  controllers: [StatementController],
  providers: [
    CreateStatementService,
    GetStatementsService,
    StatementRepository,
    PrismaConnector,
    {
      provide: 'TRANSACTION_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('transaction_ms_host'),
            port: configService.get('transaction_ms_port'),
          },
        });
      },
    },
  ],
})
export class StatementModule {}
