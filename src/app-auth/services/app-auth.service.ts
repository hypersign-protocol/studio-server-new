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
import { GenerateTokenDto } from '../dtos/generate-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly appRepository: AppRepository,
    private readonly hidWalletService: HidWalletService,
    private readonly edvService: EdvService,
    private readonly appAuthSecretService: AppAuthSecretService,
    private readonly jwt: JwtService,
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

    const appSecret = uuid();
    const hash = await this.appAuthSecretService.hashSecrets(appSecret);

    const { id: edvDocId } = await this.edvService.createDocument(document);
    const appData = await this.appRepository.create({
      ...createAppDto,
      userId,
      appId: uuid(), // generate app id
      appSecret: hash, // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: 'demo-kms-1',
      edvDocId,
      walletAddress: address,
    });

    appData.appSecret = appSecret;
    return appData;
  }

  getAllApps(userId: string): Promise<App[]> {
    return this.appRepository.find({ userId });
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
    generateTokenDto: GenerateTokenDto,
    userId: string,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    const { appId, appSecret, grantType } = generateTokenDto;
    const payload = {
      appId,
      appSecret,
      grantType,
    };
    const appDetail = await this.appRepository.findOne({
      appId,
    });

    if (!appDetail) {
      throw new UnauthorizedException(['access_denied']);
    }
    // compare appSecret sent by user and appSecret hash stored in db
    const compareHash = await this.appAuthSecretService.comapareSecret(
      appSecret,
      appDetail.appSecret,
    );
    if (!compareHash) {
      throw new UnauthorizedException(['access_denied']);
    }
    if (userId !== appDetail.userId) {
      throw new UnauthorizedException(['access_denied']);
    }
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '4h',
      secret,
    });
    const expiresIn = (4 * 1 * 60 * 60 * 1000) / 1000;
    return { access_token: token, expiresIn, tokenType: 'Bearer' };
  }
}
