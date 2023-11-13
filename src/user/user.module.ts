import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { HypersignAuthenticateMiddleware } from 'src/utils/middleware/hypersign-authenticate.middleware';
import { WhitelistAppCorsMiddleware } from 'src/app-auth/middlewares/cors.middleware';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
import { HypersignAuthorizeMiddleware } from 'src/utils/middleware/hypersign-authorize.middleware';
@Module({
  imports: [AppAuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WhitelistAppCorsMiddleware).forRoutes(UserController);

    consumer
      .apply(HypersignAuthenticateMiddleware)
      .exclude({
        path: '/api/v2/protected',
        method: RequestMethod.POST,
      })
      .forRoutes(UserController);

    consumer
      .apply(HypersignAuthorizeMiddleware)
      .exclude({
        path: '/hs/api/v2/auth',
        method: RequestMethod.POST,
      })
      .forRoutes(UserController);
  }
}
