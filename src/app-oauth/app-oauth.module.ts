import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppOauthController } from './app-oauth.controller';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [AppAuthModule, UserModule],
  controllers: [AppOauthController],
  providers: [],
})
export class AppOauthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTAuthorizeMiddleware)
      .exclude({ path: 'api/v1/app/oauth', method: RequestMethod.POST })
      .forRoutes(AppOauthController);
  }
}
