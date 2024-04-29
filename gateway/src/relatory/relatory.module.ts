import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RelatoryController } from './relatory.controller';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [RelatoryController],
  providers: [
    {
      provide: 'RELATORY_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('relatory_ms_host'),
            port: configService.get('relatory_ms_port'),
          },
        });
      },
    },
  ],
})
export class RelatoryModule {}
