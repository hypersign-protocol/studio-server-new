import { Module } from '@nestjs/common';
import { GoolgeLoginService } from './services/goolge-login.service';
import { GoolgeLoginController } from './controller/goolge-login.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [GoolgeLoginController],
  providers: [GoolgeLoginService, GoogleStrategy],
})
export class GoolgeLoginModule {}
