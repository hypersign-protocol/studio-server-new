import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth/app-auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HidWalletModule } from './hid-wallet/hid-wallet.module';
import { HidWalletService } from './hid-wallet/services/hid-wallet.service';
import { EdvModule } from './edv/edv.module';
import { AllExceptionsFilter } from './utils';
import { APP_FILTER } from '@nestjs/core';

import { AppAuthSecretService } from './app-auth/services/app-auth-passord.service';
import { DidModule } from './did/did.module';
@Module({
  imports: [
    AppAuthModule,
    ConfigModule.forRoot({
      envFilePath: '',
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_PATH),
    
    EdvModule,
    DidModule,
  ],
  controllers: [],
  providers: [ AppAuthSecretService,{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
