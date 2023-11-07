import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppOauthController } from './app-oauth.controller';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
import { WhitelistSSICorsMiddleware } from 'src/utils/middleware/cors.middleware';
@Module({
  imports: [AppAuthModule],
  controllers: [AppOauthController],
  providers: [],
})
export class AppOauthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WhitelistSSICorsMiddleware).forRoutes(AppOauthController);
  }
}
