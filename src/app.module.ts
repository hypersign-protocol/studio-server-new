import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth/app-auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HidWalletModule } from './hid-wallet/hid-wallet.module';
import { HidWalletService } from './hid-wallet/services/hid-wallet.service';
import { EdvModule } from './edv/edv.module';
import { AppAuthSecretService } from './app-auth/services/app-auth-passord.service';
@Module({
  imports: [
    AppAuthModule,
    ConfigModule.forRoot({
      envFilePath: '',
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_PATH),
    HidWalletModule,
    EdvModule,
  ],
  controllers: [],
  providers: [ AppAuthSecretService],
})
export class AppModule {}
