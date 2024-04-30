import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/environment';
import { StatementModule } from './app/modules/statement.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionMiddleware } from './interface/middlewares/exception.middleware';

@Module({
  imports: [
    StatementModule,
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
