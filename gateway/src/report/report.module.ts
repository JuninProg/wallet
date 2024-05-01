import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ReportController } from './report.controller';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ReportController],
  providers: [
    {
      provide: 'REPORT_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('report_ms_host'),
            port: configService.get('report_ms_port'),
          },
        });
      },
    },
  ],
})
export class ReportModule {}
