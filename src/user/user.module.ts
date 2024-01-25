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
import { UserRepository } from './repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema/user.schema';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AppAuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const isHypersignAuth = JSON.parse(process.env.IMPLEMENT_HYPERSIGN_AUTH);
    consumer.apply(WhitelistAppCorsMiddleware).forRoutes(UserController);
    if (isHypersignAuth) {
      consumer
        .apply(HypersignAuthenticateMiddleware)
        .exclude({
          path: '/api/v1/auth/hypersign',
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
    } else {
      consumer
        .apply(JWTAuthorizeMiddleware)
        .exclude({
          path: '/hs/api/v2/auth',
          method: RequestMethod.POST,
        })
        .forRoutes(UserController);
    }
  }
}
