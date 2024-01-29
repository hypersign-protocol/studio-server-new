import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Providers } from '../strategy/social.strategy';
import { sanitizeUrl } from 'src/utils/utils';

@Injectable()
export class SocialLoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  async generateAuthUrlByProvider(provider: string) {
    let authUrl;
    switch (provider) {
      case Providers.google: {
        authUrl = `${
          this.config.get('GOOGLE_AUTH_BASE_URL') ||
          'https://accounts.google.com/o/oauth2/v2/auth'
        }?response_type=code&redirect_uri=${
          this.config.get('GOOGLE_CALLBACK_URL') ||
          sanitizeUrl(
            this.config.get('DEVELOPER_DASHBOARD_SERVICE_PUBLIC_EP'),
          ) + '/api/v1/login/callback'
        }&scope=email%20profile&client_id=${this.config.get(
          'GOOGLE_CLIENT_ID',
        )}`;
        break;
      }
      default: {
        throw new BadRequestException(['Invalid provider']);
      }
    }
    return { authUrl };
  }

  async socialLogin(req) {
    Logger.log('googleLogin() starts', 'SocialLoginService');
    const { email, name } = req.user;
    let userInfo = await this.userRepository.findOne({
      email,
    });
    let appUserID;
    if (!userInfo) {
      appUserID = uuidv4();
      userInfo = await this.userRepository.create({
        email,
        userId: appUserID,
      });
    }
    const payload = {
      name,
      email,
      appUserID: userInfo.userId,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret,
    });
    return token;
  }
}
