import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { env } from './config/environment';
import { TransactionModule } from './transaction/transaction.module';
import { RelatoryModule } from './relatory/relatory.module';

@Module({
  imports: [
    AuthModule,
    TransactionModule,
    RelatoryModule,
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
  ],
})
export class AppModule {}
