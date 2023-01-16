import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth/app-auth.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    AppAuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/studio-api'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
