import { Module } from '@nestjs/common';
import { AppAuthService } from './services/app-auth/app-auth.service';
import { AppAuthController } from './controllers/app-auth/app-auth.controller';

@Module({
  providers: [AppAuthService],
  controllers: [AppAuthController]
})
export class AppAuthModule {}
