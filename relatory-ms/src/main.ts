import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { AppModule } from './app.module';
import { env } from './config/environment';

async function bootstrap() {
  const ENV = env();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [ENV.rabbitmqUrl],
        queue: ENV.rabbitmqRelatoryQueue,
        prefetchCount: 1,
        noAck: false,
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: ENV.host,
        port: ENV.port,
      },
    },
    { inheritAppConfig: true },
  );

  app.enableShutdownHooks();

  await app.startAllMicroservices();
}

bootstrap();
