import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { env } from './config/environment';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true, load: [env] })],
})
export class AppModule {}
