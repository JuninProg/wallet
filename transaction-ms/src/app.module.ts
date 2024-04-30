import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/environment';
import { TransactionModule } from './app/modules/transaction.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionMiddleware } from './interface/middlewares/exception.middleware';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionMiddleware,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
