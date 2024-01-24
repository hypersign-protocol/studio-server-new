import { Module } from '@nestjs/common';
import { SocialLoginService } from './services/social-login.service';
import { SocialLoginController } from './controller/social-login.controller';
import { GoogleStrategy } from './strategy/social.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [SocialLoginController],
  providers: [SocialLoginService, GoogleStrategy],
})
export class SocialLoginModule {}
