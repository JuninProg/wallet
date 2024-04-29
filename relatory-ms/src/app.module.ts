import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/environment';
import { StatementModule } from './app/modules/statement.module';

@Module({
  imports: [
    StatementModule,
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
  ],
})
export class AppModule {}
