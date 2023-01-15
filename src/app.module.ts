import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth/app-auth.module';

@Module({
  imports: [AppAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
