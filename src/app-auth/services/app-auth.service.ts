import {
  UnauthorizedException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateAppDto } from '../dtos/create-app.dto';

import { App, createAppResponse } from 'src/app-auth/schemas/app.schema';
import { AppRepository } from '../repositories/app.repository';
import { uuid } from 'uuidv4';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service';
import { EdvService } from '../../edv/services/edv.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { EdvDocsDto } from 'src/edv/dtos/create-edv.dto';
import { AppAuthSecretService } from './app-auth-passord.service';
import { JwtService } from '@nestjs/jwt';
import { AppAuthApiKeyService } from './app-auth-apikey.service';

@Injectable()
export class AppAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly appRepository: AppRepository,
    private readonly hidWalletService: HidWalletService,
    private readonly edvService: EdvService,
    private readonly appAuthSecretService: AppAuthSecretService,
    private readonly jwt: JwtService,
    private readonly appAuthApiKeyService: AppAuthApiKeyService,
  ) {}

  async createAnApp(
    createAppDto: CreateAppDto,
    userId: string,
  ): Promise<createAppResponse> {
    const { mnemonic, address } = await this.hidWalletService.generateWallet();
    const edvId = 'hs:apiservice:edv:' + uuid();
    await this.edvService.init(edvId);
    const document: EdvDocsDto = {
      mnemonic,
      address,
    };

    const { apiSecretKey, apiSecret } =
      await this.appAuthApiKeyService.generateApiKey();

    const { id: edvDocId } = await this.edvService.createDocument(document);
    const appData = await this.appRepository.create({
      ...createAppDto,
      userId,
      appId: await this.appAuthApiKeyService.generateAppId(), // generate app id
      apiKeySecret: apiSecret, // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: 'demo-kms-1',
      edvDocId,
      walletAddress: address,
      apiKeyPrefix: apiSecretKey.split('.')[0],
    });

    appData.apiKeySecret = apiSecretKey;
    return appData;
  }

  async reGenerateAppSecretKey(app, userId) {
    const { apiSecretKey, apiSecret } =
      await this.appAuthApiKeyService.generateApiKey();

    const appData = await this.appRepository.findOneAndUpdate(
      { appId: app.appId, userId },
      { apiKeyPrefix: apiSecretKey.split('.')[0], apiKeySecret: apiSecret },
    );

    return { apiSecretKey };
  }

  getAllApps(userId: string, paginationOption) {
    const skip = (paginationOption.page - 1) * paginationOption.limit;
    paginationOption.skip = skip;
    return this.appRepository.find({
      userId,
      paginationOption,
    });
  }

  async getAppById(appId: string, userId: string): Promise<App> {
    return this.appRepository.findOne({ appId, userId });
  }

  updateAnApp(
    appId: string,
    updataAppDto: UpdateAppDto,
    userId: string,
  ): Promise<App> {
    return this.appRepository.findOneAndUpdate({ appId, userId }, updataAppDto);
  }

  async generateAccessToken(
    appSecreatKey: string,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    const apikeyIndex = appSecreatKey.split('.')[0];

    const grantType = 'client_credentials'; //TODO: Remove hardcoding
    const appDetail = await this.appRepository.findOne({
      apiKeyPrefix: apikeyIndex,
    });
    if (!appDetail) {
      throw new UnauthorizedException(['access_denied']);
    }

    const compareHash = await this.appAuthSecretService.comapareSecret(
      appSecreatKey,
      appDetail.apiKeySecret,
    );

    if (!compareHash) {
      throw new UnauthorizedException('access_denied');
    }

    const payload = {
      appId: appDetail.appId,
      userId: appDetail.userId,
      grantType,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '4h',
      secret,
    });
    const expiresIn = (4 * 1 * 60 * 60 * 1000) / 1000;
    return { access_token: token, expiresIn, tokenType: 'Bearer' };
  }
}
