import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { AppAuthSecretService } from './app-auth-passord.service';

@Injectable()
export class AppAuthApiKeyService {
  constructor(private readonly appAuthService: AppAuthSecretService) {}
  private generateRandomString(length: number): string {
    Logger.log(
      'generateRandomString() method: starts....',
      'AppAuthApiKeyService',
    );

    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  async generateApiKey() {
    Logger.log('generateApiKey() method: starts....', 'AppAuthApiKeyService');

    const apiSecretKey = this.generateRandomString(29);
    const secret = this.generateRandomString(97);
    const toHash = apiSecretKey + '.' + secret;
    const apiSecret = await this.appAuthService.hashSecrets(toHash);

    return {
      apiSecretKey: toHash,
      apiSecret,
    };
  }
  async generateAppId() {
    Logger.log('generateAppId() method: starts....', 'AppAuthApiKeyService');

    return await this.generateRandomString(36);
  }
}
