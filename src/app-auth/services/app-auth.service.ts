import {
  UnauthorizedException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAppDto } from '../dtos/create-app.dto';
import { App, createAppResponse } from 'src/app-auth/schemas/app.schema';
import { AppRepository } from '../repositories/app.repository';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service';
import { ConfigService } from '@nestjs/config';
import { EdvDocsDto } from 'src/edv/dtos/create-edv.dto';
import { AppAuthSecretService } from './app-auth-passord.service';
import { JwtService } from '@nestjs/jwt';
import { AppAuthApiKeyService } from './app-auth-apikey.service';
import { EdvClientManagerFactoryService } from '../../edv/services/edv.clientFactory';
import { VaultWalletManager } from '../../edv/services/vaultWalletManager';
import * as url from 'url';
import { SupportedServiceService } from 'src/supported-service/services/supported-service.service';
import { SERVICE_TYPES } from 'src/supported-service/services/service-list';

enum GRANT_TYPES {
  access_service_kyc = 'access_service_kyc',
  access_service_ssi = 'access_service_ssi',
}

@Injectable()
export class AppAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly appRepository: AppRepository,
    private readonly hidWalletService: HidWalletService,
    private readonly appAuthSecretService: AppAuthSecretService,
    private readonly jwt: JwtService,
    private readonly appAuthApiKeyService: AppAuthApiKeyService,
    private readonly supportedServices: SupportedServiceService,
  ) {}

  async createAnApp(
    createAppDto: CreateAppDto,
    userId: string,
  ): Promise<createAppResponse> {
    Logger.log('createAnApp() method: starts....', 'AppAuthService');

    const { serviceIds } = createAppDto;
    if (!serviceIds) {
      throw new Error('No serviceIds provided while creating an app');
    }

    const service = this.supportedServices.fetchServiceById(serviceIds[0]);
    if (!service) {
      throw new Error('Invalid service id ' + serviceIds[0]);
    }

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
      services: [service],
      userId,
      appId: appId, // generate app id
      apiKeySecret: apiSecret, // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: kmsId,
      walletAddress: address,
      apiKeyPrefix: apiSecretKey.split('.')[0],
      subdomain,
    });
    Logger.log('App created successfully', 'app-auth-service');
    Logger.log(JSON.stringify(appData));
    return this.getAppResponse(appData, apiSecretKey);
  }

  private getAppResponse(
    appData: App,
    apiSecretKey?: string,
  ): createAppResponse {
    const appResponse: createAppResponse = {
      ...appData['_doc'],
      apiSecretKey,
      tenantUrl: this.getTenantUrl(appData.subdomain, appData.services[0]), // only one service per app
    };

    delete appResponse.userId;
    delete appResponse['_id'];
    delete appResponse['__v'];
    delete appResponse['apiKeySecret'];
    delete appResponse['apiKeyPrefix'];
    return appResponse;
  }

  // fix the type for service
  private getTenantUrl(subdomain: string, service: object) {
    Logger.log('Inside getTenantUrl()', 'app-auth.service');
    const domain = this.supportedServices.fetchServiceById(
      service['id'],
    )?.domain;
    Logger.log(domain, 'app-auth.service');

    const SERVICE_BASE_URL = url.parse(domain);

    const tenantUrl =
      SERVICE_BASE_URL.protocol +
      '//' +
      subdomain +
      '.' +
      SERVICE_BASE_URL.host +
      SERVICE_BASE_URL.pathname;
    return tenantUrl;
  }

  private async getRandomSubdomain() {
    const subdomain = await this.appAuthApiKeyService.generateAppId(7);
    const appInDb = await this.appRepository.findOne({
      subdomain: subdomain,
    });

    if (!appInDb) {
      Logger.log('Found subdomain in db, going recursively');
      const tenantSubDomainPrefixEnv = this.config.get(
        'TENANT_SUBDOMAIN_PREFIX',
      );
      return (
        (tenantSubDomainPrefixEnv && tenantSubDomainPrefixEnv != 'undefined'
          ? tenantSubDomainPrefixEnv
          : 'ent-') + subdomain
      );
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
      {
        apiKeyPrefix: apiSecretKey.split('.')[0],
        apiKeySecret: apiSecret,
      },
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

  async getAppById(appId: string, userId: string): Promise<any> {
    Logger.log('getAppById() method: starts....', 'AppAuthService');
    const app: App = await this.appRepository.findOne({ appId, userId });
    return app;
  }

  async updateAnApp(
    appId: string,
    updataAppDto: UpdateAppDto,
    userId: string,
  ): Promise<createAppResponse> {
    Logger.log('updateAnApp() method: starts....', 'AppAuthService');
    const app: App = await this.appRepository.findOneAndUpdate(
      { appId, userId },
      updataAppDto,
    );
    return this.getAppResponse(app);
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
  ): Promise<{ access_token; expiresIn; tokenType }> {
    Logger.log('generateAccessToken() method: starts....', 'AppAuthService');

    const apikeyIndex = appSecreatKey.split('.')[0];

    const appDetail = await this.appRepository.findOne({
      apiKeyPrefix: apikeyIndex,
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

    const serviceType = appDetail.services[0]?.id; // TODO: remove this later
    let grant_type = '';
    switch (serviceType) {
      case SERVICE_TYPES.SSI_API: {
        grant_type = GRANT_TYPES.access_service_ssi;
        break;
      }
      case SERVICE_TYPES.CAVACH_API: {
        grant_type = GRANT_TYPES.access_service_kyc;
        break;
      }
      default: {
        throw new BadRequestException('Invalid service ' + appDetail.appId);
      }
    }

    return this.getAccessToken(grant_type, appDetail);
  }

  private async getAccessToken(grantType, appDetail) {
    const payload = {
      appId: appDetail.appId,
      userId: appDetail.userId,
      grantType,
      kmsId: appDetail.kmsId,
      whitelistedCors: appDetail.whitelistedCors,
      subdomain: appDetail.subdomain,
      edvId: appDetail.edvId,
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

  //access_service_ssi
  //access_service_kyc

  async grantPermission(
    grantType: string,
    userId: string,
    appId: string,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    switch (grantType) {
      case GRANT_TYPES.access_service_ssi:
        break;
      case GRANT_TYPES.access_service_kyc:
        break;
      default: {
        throw new BadRequestException('Grant type not supported');
      }
    }

    const app = await this.getAppById(appId, userId);
    if (!app) {
      throw new BadRequestException(
        'Invalid service id or you do not have access of this service',
      );
    }

    const serviceType = app.services[0]?.id; // TODO: remove this later
    switch (serviceType) {
      case SERVICE_TYPES.SSI_API: {
        if (grantType != 'access_service_ssi') {
          throw new BadRequestException(
            'Invalid grant type for this service ' + appId,
          );
        }
        break;
      }
      case SERVICE_TYPES.CAVACH_API: {
        if (grantType != 'access_service_kyc') {
          throw new BadRequestException(
            'Invalid grant type for this service ' + appId,
          );
        }
        break;
      }
      default: {
        throw new BadRequestException('Invalid service ' + appId);
      }
    }
    return this.getAccessToken(grantType, app);
  }
}
