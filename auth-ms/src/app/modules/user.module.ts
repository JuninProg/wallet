import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaConnector } from 'src/infra/database/prisma';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { UserController } from 'src/interface/user/controller';
import { GetUserService } from '../services/user/get-user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [GetUserService, UserRepository, PrismaConnector],
})
export class UserModule {}
