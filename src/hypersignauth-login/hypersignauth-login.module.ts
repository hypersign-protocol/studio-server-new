import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HypersignauthLoginService } from './services/hypersignauth-login.service';
import { HypersignauthLoginController } from './controllers/hypersignauth-login.controller';
import { UserModule } from 'src/user/user.module';
import { HypersignAuthenticateMiddleware } from 'src/utils/middleware/hypersign-authenticate.middleware';
import { WhitelistAppCorsMiddleware } from 'src/app-auth/middlewares/cors.middleware';
import { HypersignAuthorizeMiddleware } from 'src/utils/middleware/hypersign-authorize.middleware';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
@Module({
  imports: [UserModule, AppAuthModule],
  controllers: [HypersignauthLoginController],
  providers: [HypersignauthLoginService],
})
export class HypersignauthLoginModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistAppCorsMiddleware)
      .forRoutes(HypersignauthLoginController);
    consumer
      .apply(HypersignAuthenticateMiddleware)
      .exclude({
        path: '/api/v1/auth/hypersign',
        method: RequestMethod.POST,
      })
      .forRoutes(HypersignauthLoginController);

    consumer
      .apply(HypersignAuthorizeMiddleware)
      .exclude({
        path: '/hs/api/v2/auth',
        method: RequestMethod.POST,
      })
      .forRoutes(HypersignauthLoginController);
  }
}

