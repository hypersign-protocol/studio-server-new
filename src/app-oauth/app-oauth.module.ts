import { Module } from '@nestjs/common';
import { AppOauthController } from './app-oauth.controller';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
@Module({
  imports: [AppAuthModule],
  controllers: [AppOauthController],
  providers: [],
})
export class AppOauthModule {}
