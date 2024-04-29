import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { AppModule } from './app.module';
import { env } from './config/environment';
import { HttpExceptionMiddleware } from './interface/middlewares/exception.middleware';

async function bootstrap() {
  const ENV = env();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [ENV.rabbitmqUrl],
      queue: ENV.rabbitmqRelatoryQueue,
      prefetchCount: 1,
      noAck: false,
    },
  });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: ENV.host,
      port: ENV.port,
    },
  });

  app.enableShutdownHooks();

  app.useGlobalFilters(new HttpExceptionMiddleware());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();
}

bootstrap();
