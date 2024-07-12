import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Providers } from '../strategy/social.strategy';
import { sanitizeUrl } from 'src/utils/utils';
import { SupportedServiceList } from 'src/supported-service/services/service-list';
import { SERVICE_TYPES } from 'src/supported-service/services/iServiceList';
import { AuthneticatorType } from '../dto/response.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Generate2FA, MFACodeVerificationDto } from '../dto/request.dto';

@Injectable()
export class SocialLoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly supportedServiceList: SupportedServiceList,
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
      // Giving default access of services...
      const ssiAccessList = this.supportedServiceList.getDefaultServicesAccess(
        SERVICE_TYPES.SSI_API,
      );
      const kycAccessList = this.supportedServiceList.getDefaultServicesAccess(
        SERVICE_TYPES.CAVACH_API,
      );
      userInfo = await this.userRepository.create({
        email,
        userId: appUserID,
        accessList: [...ssiAccessList, ...kycAccessList],
      });
    }
    const payload = {
      name,
      email,
      appUserID: userInfo.userId,
      userAccessList: userInfo.accessList,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret,
    });
    return token;
  }

  async generate2FA(genrate2FADto: Generate2FA, user) {
    Logger.log(
      'Inside generate2FA() method to generate 2FA QRCode',
      'SocialLoginService',
    );
    const { authenticatorType } = genrate2FADto;
    let secret;
    if (authenticatorType == AuthneticatorType.google) {
      if (user && !user.twoFAGoogleSecret) {
        secret = authenticator.generateSecret(20);
        this.userRepository.findOneUpdate(
          { userId: user.userId },
          { twoFAGoogleSecret: secret, isGoogleTwoFAEnabled: true },
        );
      } else {
        secret = user.twoFAGoogleSecret;
      }
    } else if (authenticatorType == AuthneticatorType.okta) {
      if (user && !user.twoFAOktaSecret) {
        secret = authenticator.generateSecret(20);
        this.userRepository.findOneUpdate(
          { userId: user.userId },
          { twoFAOktaSecret: secret, isOktaTwoFAEnabled: true },
        );
      } else {
        secret = user.twoFAOktaSecret;
      }
    }
    const issuer = this.config.get('MFA_ISSUER');
    const otpAuthUrl = authenticator.keyuri(user.email, issuer, secret);
    return toDataURL(otpAuthUrl);
  }
  async verifyMFACode(user, mfaVerificationDto: MFACodeVerificationDto) {
    Logger.log(
      'Inside verifyMFACode() method to verify MFA code',
      'SocialLoginService',
    );
    const { authenticatorType, twoFactorAuthenticationCode } =
      mfaVerificationDto;
    const secret =
      authenticatorType === AuthneticatorType.google
        ? user.twoFAGoogleSecret
        : user.twoFAOktaSecret;
    const isVerified = authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret,
    });
    const payload = {
      email: user.email,
      appUserID: user.userId,
      userAccessList: user.accessList,
      isTwoFactorEnabled:
        !!user.isGoogleTwoFAEnabled || !!user.isOktaTwoFAEnabled,
      isTwoFactorAuthenticated: isVerified,
    };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      isVerified,
      accessToken,
    };
  }
}
