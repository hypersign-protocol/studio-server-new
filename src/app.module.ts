import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth/app-auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EdvModule } from './edv/edv.module';
import { AllExceptionsFilter } from './utils/utils';
import { APP_FILTER } from '@nestjs/core';

import { AppAuthSecretService } from './app-auth/services/app-auth-passord.service';
import { AppOauthModule } from './app-oauth/app-oauth.module';
import { UserModule } from './user/user.module';
import { SupportedServiceModule } from './supported-service/supported-service.module';
import { GoolgeLoginModule } from './goolge-login/goolge-login.module';

@Module({
  imports: [
    AppAuthModule,
    ConfigModule.forRoot({
      envFilePath: '',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_PATH),
    EdvModule,
    AppOauthModule,
    UserModule,
    SupportedServiceModule,
    GoolgeLoginModule,
  ],
  controllers: [],
  providers: [
    AppAuthSecretService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
