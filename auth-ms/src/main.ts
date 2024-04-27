import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { AppModule } from './app.module';
import { env } from './config/environment';
import { HttpExceptionMiddleware } from './interface/middlewares/exception.middleware';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: env().host,
      port: env().port,
    },
  });

  app.enableShutdownHooks();

  app.useGlobalFilters(new HttpExceptionMiddleware());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
}

bootstrap();
