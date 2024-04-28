import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/environment';
import { TransactionModule } from './app/modules/transaction.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
  ],
})
export class AppModule {}
