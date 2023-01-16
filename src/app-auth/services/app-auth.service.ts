import { Injectable } from '@nestjs/common';
import { CreateAppDto } from '../dtos/create-app.dto';

// @ts-ignore
import { App } from 'src/app-auth/schemas/app.schema';
// @ts-ignore
import { AppRepository } from 'src/app-auth/repositories/app.repository';
import { uuid } from 'uuidv4';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { EdvService } from 'src/edv/services/edv.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { EdvDocsDto } from 'src/edv/dtos/create-edv.dto';
import { AppAuthSecretService } from './app-auth-passord.service';
@Injectable()
export class AppAuthService {
  constructor(private readonly config: ConfigService, private readonly appRepository: AppRepository, private readonly hidWalletService: HidWalletService, private readonly edvService: EdvService, private readonly appAuthSecretService:AppAuthSecretService) { }

  async createAnApp(createAppDto: CreateAppDto ): Promise<App> {
    const { mnemonic, address } = await this.hidWalletService.generateWallet()
    const apiServerKeys = JSON.parse(fs.readFileSync(this.config.get('EDV_KEY_FILE_PATH')).toString())
    const edvServiceDidDoc = JSON.parse(fs.readFileSync(this.config.get('EDV_DID_FILE_PATH')).toString())
    await this.edvService.setAuthenticationKey(apiServerKeys, edvServiceDidDoc.authentication[0], edvServiceDidDoc.controller[0])
    const edvId = "hs:apiservice:edv:" + uuid()
    await this.edvService.init(edvId)
    const document:EdvDocsDto = {
      mnemonic,
      address,      
    }

    const appSecret =uuid()
    const hash=await this.appAuthSecretService.hashSecrets(appSecret)

    const {id : edvDocId}=await this.edvService.createDocument(document)   
    
    const appData= await this.appRepository.create({
      ...createAppDto,
      appId: uuid(), // generate app id
      appSecret:hash , // TODO: generate app secret and should be handled like password by hashing and all...
      edvId, // generate edvId  by called hypersign edv service
      kmsId: 'demo-kms-1',
      edvDocId,

    });
     appData.appSecret=appSecret
     return appData
  }

  getAllApps(): Promise<App[]> {
    return this.appRepository.find({});
  }

  getAppById(appId: string): Promise<App> {
    return this.appRepository.findOne({ appId });
  }

  updateAnApp(appId: string, updataAppDto: UpdateAppDto): Promise<App> {
    return this.appRepository.findOneAndUpdate({ appId }, updataAppDto);
  }
}
