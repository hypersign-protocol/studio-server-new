import { Injectable } from '@nestjs/common';
import { CreateAppDto } from '../../dtos/create-app.dto';
import { App } from 'src/app-auth/schemas/app.schema';
import { AppRepository } from 'src/app-auth/repositories/app.repository';
import { uuid } from 'uuidv4';
import { UpdateAppDto } from '../../dtos/update-app.dto';

@Injectable()
export class AppAuthService {
  constructor(private readonly appRepository: AppRepository) {}

  createAnApp(createAppDto: CreateAppDto): Promise<App> {
    return this.appRepository.create({
      ...createAppDto,
      appId: uuid(), // generate app id
      appSecret: uuid(), // TODO: generate app secret and should be handled like password by hashing and all...
      edvId: 'hs-edv-1', // generate edvId  by called hypersign edv service
      kmsId: 'demo-kms-1',
    });
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
