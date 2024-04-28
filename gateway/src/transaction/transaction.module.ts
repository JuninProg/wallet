import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TransactionController],
  providers: [
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
export class TransactionModule {}
