import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SocialLoginService } from './services/social-login.service';
import { SocialLoginController } from './controller/social-login.controller';
import { GoogleStrategy } from './strategy/social.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { WhitelistAppCorsMiddleware } from 'src/app-auth/middlewares/cors.middleware';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
// import { DynamicAuthGuard } from './strategy/dynamic-auth-gaurd';

@Module({
  imports: [UserModule, AppAuthModule, JwtModule.register({})],
  controllers: [SocialLoginController],
  providers: [SocialLoginService, GoogleStrategy],
})
export class SocialLoginModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistAppCorsMiddleware)
      .exclude({
        path: '/api/v1/login',
        method: RequestMethod.GET,
      })
      .forRoutes(SocialLoginController);
    consumer
      .apply(JWTAuthorizeMiddleware)
      .exclude({
        path: '/api/v1/login',
        method: RequestMethod.GET,
      })
      .forRoutes(SocialLoginController);
  }
}
