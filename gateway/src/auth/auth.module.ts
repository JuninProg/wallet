import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

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
          options: {
            host: configService.get('auth_ms_host'),
            port: configService.get('auth_ms_port'),
          },
        });
      },
    },
  ],
})
export class AuthModule {}
