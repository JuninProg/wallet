import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('auth_ms_host'),
            port: configService.get('auth_ms_port'),
          },
        });
      },
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
