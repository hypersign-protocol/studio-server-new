import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppAuthService } from './services/app-auth.service';
import { AppAuthController } from './controllers/app-auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';

import { AppRepository } from './repositories/app.repository';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { HidWalletModule } from 'src/hid-wallet/hid-wallet.module';
import { EdvModule } from 'src/edv/edv.module';
import { AppAuthSecretService } from './services/app-auth-passord.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AppAuthApiKeyService } from './services/app-auth-apikey.service';
import { TrimMiddleware } from 'src/utils/middleware/trim.middleware';
import { HypersignAuthorizeMiddleware } from 'src/utils/middleware/hypersign-authorize.middleware';
import { HypersignAuthDataTransformerMiddleware } from '../user/middleware/tranform-hypersign-user-data';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
    HidWalletModule,
    EdvModule,

    JwtModule.register({}),
  ],
  providers: [
    AppAuthService,
    AppRepository,
    HidWalletService,
    AppAuthSecretService,
    JwtStrategy,
    AppAuthApiKeyService,
  ],
  controllers: [AppAuthController],

  exports: [AppAuthService, AppRepository, AppAuthApiKeyService, AppAuthModule],
})
export class AppAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrimMiddleware)
      .exclude(
        { path: 'app', method: RequestMethod.GET },
        { path: 'app', method: RequestMethod.DELETE },
        { path: 'app/:appId', method: RequestMethod.GET },
      )
      .forRoutes(AppAuthController);

    consumer.apply(HypersignAuthorizeMiddleware).forRoutes(AppAuthController);

    consumer
      .apply(HypersignAuthDataTransformerMiddleware)
      .forRoutes(AppAuthController);
  }
}
