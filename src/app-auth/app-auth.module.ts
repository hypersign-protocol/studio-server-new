import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppAuthService } from './services/app-auth.service';
import {
  AppAuthController,
  AppOAuthController,
} from './controllers/app-auth.controller';
import { ValidateHeadersMiddleware } from './middlewares/validate-headers.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';

import { AppRepository } from './repositories/app.repository';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { HidWalletModule } from 'src/hid-wallet/hid-wallet.module';
import { EdvModule } from 'src/edv/edv.module';
import { EdvService } from 'src/edv/services/edv.service';
import { AppAuthSecretService } from './services/app-auth-passord.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, JwtStrategyApp } from './strategy/jwt.strategy';
import { AppAuthApiKeyService } from './services/app-auth-apikey.service';
import { WhitelistMiddleware } from 'src/utils/middleware/cors.middleware';
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
    EdvService,
    AppAuthSecretService,
    JwtStrategy,
    JwtStrategyApp,
    AppAuthApiKeyService,
  ],
  controllers: [AppAuthController, AppOAuthController],

  exports: [AppAuthService, AppRepository],
})
export class AppAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply( WhitelistMiddleware)
      .forRoutes(AppAuthController,AppOAuthController);
  }
}
