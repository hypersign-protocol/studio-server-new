import { Injectable } from '@nestjs/common';
import { IApp } from '../../types/App.types';
import { CreateAppDto } from '../../dtos/CreateApp.dto';
import { AppSchema  } from 'src/app-auth/schemas/App.schema'; 

@Injectable()
export class AppAuthService {
    private apps: IApp[] = []

    createAnApp(createAppDto: CreateAppDto): IApp{
        const appSchema = new AppSchema({
            ...createAppDto,
            appId: 'demo-app1', // generate app id
            appSecret: 'demo-secret-1', // generate app secret
            edvId: 'hs-edv-1', // generate edvId  by called hypersign edv service
            kmsId: 'demo-kms-1' 
        })
        this.apps.push(appSchema);
        return appSchema
    }

    getAllApps () {
        return this.apps
    }
}
