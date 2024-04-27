import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaConnector } from 'src/infra/database/prisma';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { AuthController } from 'src/interface/auth/controller';
import { SignUpService } from '../services/auth/sign-up.service';
import { SignInService } from '../services/auth/sign-in.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (service: ConfigService) => ({
        secret: service.get<string>('secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [SignUpService, SignInService, UserRepository, PrismaConnector],
})
export class AuthModule {}
