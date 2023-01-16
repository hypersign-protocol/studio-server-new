import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppAuthService } from './services/app-auth.service';
import { AppAuthController } from './controllers/app-auth.controller';
import { ValidateHeadersMiddleware } from './middlewares/validate-headers.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';

import { AppRepository } from './repositories/app.repository';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { HidWalletModule } from 'src/hid-wallet/hid-wallet.module';
import { EdvModule } from 'src/edv/edv.module';
import { EdvService } from 'src/edv/services/edv.service';
import { AppAuthSecretService } from './services/app-auth-passord.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),HidWalletModule,EdvModule],
  providers: [AppAuthService, AppRepository,HidWalletService,EdvService,AppAuthSecretService],
  controllers: [AppAuthController],
})
export class AppAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //// Appy middleware on all routes
    consumer.apply(ValidateHeadersMiddleware).forRoutes(AppAuthController);

    //// or Apply on specific routes
    // consumer.apply(ValidateHeadersMiddleware).forRoutes({
    //     path: '/app-auth/register',
    //     method: RequestMethod.POST,
    // })
  }
}
