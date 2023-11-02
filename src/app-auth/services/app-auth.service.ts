import {
  UnauthorizedException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAppDto } from '../dtos/create-app.dto';

import { App, createAppResponse } from 'src/app-auth/schemas/app.schema';
import { AppRepository } from '../repositories/app.repository';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service';
import { EdvService } from '../../edv/services/edv.service';
import { ConfigService } from '@nestjs/config';
import { EdvDocsDto } from 'src/edv/dtos/create-edv.dto';
import { AppAuthSecretService } from './app-auth-passord.service';
import { JwtService } from '@nestjs/jwt';
import { AppAuthApiKeyService } from './app-auth-apikey.service';
import { EdvClientManagerFactoryService } from '../../edv/services/edv.clientFactory';
import { VaultWalletManager } from '../../edv/services/vaultWalletManager';

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
    Logger.log('createAnApp() method: starts....', 'AppAuthService');
    const { mnemonic, address } = await this.hidWalletService.generateWallet();
    const appId = await this.appAuthApiKeyService.generateAppId();
    const vaultPrefixInEnv = this.config.get('VAULT_PREFIX');
    const vaultPrefix = vaultPrefixInEnv ? vaultPrefixInEnv : 'hs:studio-api:';
    const edvId = vaultPrefix + 'app:' + appId;
    Logger.log(
      'createAnApp() method: initialising edv service',
      'AppAuthService',
    );

    // Store menemonic and edvId in the key manager vault and get the kmsId.
    const doc = {
      mnemonic,
      edvId: edvId,
    };
    Logger.log(
      'createAnApp() method: Prepareing app keys to insert in kms vault',
    );

    if (!globalThis.kmsVault) {
      throw new InternalServerErrorException('KMS vault is not initialized');
    }

    const edvDocToInsert = globalThis.kmsVault.prepareEdvDocument(doc, [
      { index: 'content.edvId', unique: true },
    ]);

    Logger.log(
      'createAnApp() method: Inserting app keys to insert in kms vault',
    );
    const { id: kmsId } = await globalThis.kmsVault.insertDocument(
      edvDocToInsert,
    );

    // TODO use mnemonic as a seed to generate API keys
    Logger.log('createAnApp() method: generating api key', 'AppAuthService');
    const { apiSecretKey, apiSecret } =
      await this.appAuthApiKeyService.generateApiKey();

    Logger.log('createAnApp() method: Preparing wallet for the app');
    // TODO generate vault for this app.
    const appVaultWallet = await VaultWalletManager.getWallet(mnemonic);
    // we do not need to storing anything in the app's vault, we just create a vault for this guy
    Logger.log('createAnApp() method: Creating vault for the app');
    await EdvClientManagerFactoryService.createEdvClientManger(
      appVaultWallet,
      edvId,
    );

    Logger.log(
      'createAnApp() method: before creating new app doc in db',
      'AppAuthService',
    );
    const subdomain = await this.getRandomSubdomain();
    // Finally stroring application in db
    const appData: App = await this.appRepository.create({
      ...createAppDto,
      userId,
      appId: appId, // generate app id
      apiKeySecret: apiSecret, // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: kmsId,
      edvDocId: kmsId, // TODO this should be deprecated in favor of kmsId variable.
      walletAddress: address,
      apiKeyPrefix: apiSecretKey.split('.')[0],
      subdomain,
    });

    const baseURl = this.config.get('ENTITY_API_SERVICE_BASE_URL')
      ? this.config.get('ENTITY_API_SERVICE_BASE_URL')
      : 'https://api.entity.hypersign.id';
    const url = require('node:url');
    const SERVICE_BASE_URL = url.parse(baseURl);

    const appResponse: createAppResponse = {
      ...appData['_doc'],
      apiSecretKey,
      baseAPIUrl:
        SERVICE_BASE_URL.protocol +
        '//' +
        appData.subdomain +
        '.' +
        SERVICE_BASE_URL.host +
        SERVICE_BASE_URL.pathname,
    };

    delete appResponse.userId;
    delete appResponse['_id'];
    delete appResponse['__v'];
    Logger.log('App created successfully', 'app-auth-service');
    return appResponse;
  }

  private async getRandomSubdomain() {
    let subdomain = await this.appAuthApiKeyService.generateAppId(7);
    const appInDb = await this.appRepository.findOne({
      subdomain: subdomain,
    });

    if (!appInDb) {
      Logger.log('Found subdomain in db, going recursively');
      return this.config.get('TENANT_SUBDOMAIN_PREFIX') + subdomain;
    }

    await this.getRandomSubdomain();
  }

  async reGenerateAppSecretKey(app, userId) {
    Logger.log('reGenerateAppSecretKey() method: starts....');

    Logger.log(
      'reGenerateAppSecretKey() method: generating api key',
      'AppAuthService',
    );

    const { apiSecretKey, apiSecret } =
      await this.appAuthApiKeyService.generateApiKey();
    Logger.log(
      'reGenerateAppSecretKey() method: before calling app repository to updating app detail in db',
      'AppAuthService',
    );

    await this.appRepository.findOneAndUpdate(
      { appId: app.appId, userId },
      { apiKeyPrefix: apiSecretKey.split('.')[0], apiKeySecret: apiSecret },
    );

    return { apiSecretKey };
  }

  getAllApps(userId: string, paginationOption) {
    Logger.log('getAllApps() method: starts....', 'AppAuthService');

    const skip = (paginationOption.page - 1) * paginationOption.limit;
    paginationOption.skip = skip;
    Logger.log(
      'getAllApps() method: before calling app repository to fetch app details',
      'AppAuthService',
    );

    return this.appRepository.find({
      userId,
      paginationOption,
    });
  }

  async getAppById(appId: string, userId: string): Promise<App> {
    Logger.log('getAppById() method: starts....', 'AppAuthService');

    return this.appRepository.findOne({ appId, userId });
  }

  updateAnApp(
    appId: string,
    updataAppDto: UpdateAppDto,
    userId: string,
  ): Promise<App> {
    Logger.log('updateAnApp() method: starts....', 'AppAuthService');

    return this.appRepository.findOneAndUpdate({ appId, userId }, updataAppDto);
  }

  async deleteApp(appId: string, userId: string): Promise<App> {
    Logger.log('deleteApp() method: starts....', 'AppAuthService');

    let appDetail = await this.appRepository.findOne({ appId, userId });
    if (!appDetail) {
      Logger.error('deleteApp() method: Error: no app found', 'AppAuthService');

      throw new NotFoundException([`No App found for appId ${appId}`]);
    }
    //commenting this code as delete operation is not implemented in edvClient

    // const { edvId, edvDocId } = appDetail;
    // await this.edvService.init(edvId);
    // await this.edvService.deleteDoc(edvDocId);
    appDetail = await this.appRepository.findOneAndDelete({ appId, userId });
    return appDetail;
  }

  async generateAccessToken(
    appSecreatKey: string,
    appSubdomain: string,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    Logger.log('generateAccessToken() method: starts....', 'AppAuthService');

    const apikeyIndex = appSecreatKey.split('.')[0];

    const grantType = 'client_credentials'; //TODO: Remove hardcoding
    const appDetail = await this.appRepository.findOne({
      apiKeyPrefix: apikeyIndex,
      subdomain: appSubdomain,
    });
    if (!appDetail) {
      Logger.error(
        'generateAccessToken() method: Error: no app found',
        'AppAuthService',
      );

      throw new UnauthorizedException(['access_denied']);
    }

    const compareHash = await this.appAuthSecretService.comapareSecret(
      appSecreatKey,
      appDetail.apiKeySecret,
    );

    if (!compareHash) {
      Logger.error(
        'generateAccessToken() method: Error: hashMismatch',
        'AppAuthService',
      );

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
    Logger.log('generateAccessToken() method: ends....', 'AppAuthService');

    return { access_token: token, expiresIn, tokenType: 'Bearer' };
  }
}
