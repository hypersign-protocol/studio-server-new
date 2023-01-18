import { UnauthorizedException, Injectable } from '@nestjs/common';
import { CreateAppDto, CreateAppResponseDto } from '../dtos/create-app.dto';

import { App } from 'src/app-auth/schemas/app.schema';
import { AppRepository } from '../repositories/app.repository';
import { uuid } from 'uuidv4';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service';
import { EdvService } from '../../edv/services/edv.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { EdvDocsDto } from 'src/edv/dtos/create-edv.dto';
import { AppAuthSecretService } from './app-auth-passord.service';
import {
  GenerateTokenDto,
  GenerateTokenResponseDto,
} from '../dtos/generate-token.dto';
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

  async createAnApp(createAppDto: CreateAppDto): Promise<CreateAppResponseDto> {
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
      appId: uuid(), // generate app id
      appSecret: hash, // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: 'demo-kms-1',
      edvDocId,
    });

    return {
      appId: appData.appId,
      appName: appData.appName,
      appSecret,
      walletAddress: address,
    };
  }

  getAllApps(): Promise<App[]> {
    return this.appRepository.find({});
  }

  async getAppById(appId: string): Promise<CreateAppResponseDto> {
    const appDetail = await this.appRepository.findOne({ appId });
    const docId = appDetail['edvDocId'];
    const edvDetail = await this.edvService.getDecryptedDocument(docId);
    return {
      appId: appDetail.appId,
      appName: appDetail.appName,
      walletAddress: edvDetail.address,
    };
  }

  updateAnApp(appId: string, updataAppDto: UpdateAppDto): Promise<App> {
    return this.appRepository.findOneAndUpdate({ appId }, updataAppDto);
  }

  async generateAccessToken(
    generateTokenDto: GenerateTokenDto,
  ): Promise<GenerateTokenResponseDto> {
    const { appId, appSecret, grantType } = generateTokenDto;
    const payload = {
      appId,
      appSecret,
      grantType,
    };

    // need to find a way to validate appSecret and query db using appId and appSecret
    const appDetail = await this.appRepository.findOne({
      appId,
    });

    if (!appDetail) {
      throw new UnauthorizedException('access_denied');
    }
    const compareHash = await this.appAuthSecretService.comapareSecret(
      appSecret,
      appDetail.appSecret,
    );
    if (!compareHash) {
      throw new UnauthorizedException('access_denied');
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
