import { Injectable } from '@nestjs/common';
import { IApp } from '../../types/App.types';
import { CreateAppDto } from '../../dtos/CreateApp.dto';
@Injectable()
export class AppAuthService {
    private apps = [
        {
            userId: "user123",
            appName: "app1",
            appId: "app-1",
            appSecret: "app-secret-1",
            edvId: "edv-1",
            kmsId: "kms-1",
        }
    ]

    createAnApp(createAppDto: CreateAppDto){
        const newApp = {
            ...createAppDto,
            appId: 'app-1',
            appSecret: "app-secret-1",
            edvId: "edv-1",
            kmsId: "kms-1",
        }
        this.apps.push(newApp);
        return newApp
    }

    getAllApps () {
        return this.apps
    }
}
