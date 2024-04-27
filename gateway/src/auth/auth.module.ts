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
            url: configService.get('auth_ms')
          },
        });
      },
    },
  ],
})
export class AuthModule {}
