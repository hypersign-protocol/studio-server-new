import { ApiProperty } from '@nestjs/swagger';
import { IApp } from '../types/App.types';

// TODO: this should be changed into mongo db schema
export class AppSchema implements IApp {
    @ApiProperty({
        description: "User DID",
        example: "did:hid:testnet:123123"
    })
    userId: string;

    @ApiProperty({
        description: "Application name",
        example: "demo app"
    })
    appName: string;

    @ApiProperty({
        description: "Application id",
        example: "app-1"
    })
    appId: string;
    
    @ApiProperty({
        description: "Application Secret",
        example: "app-secret-1"
    })
    appSecret: string;
    
    @ApiProperty({
        description: "Data Vault Id",
        example: "hs-edv-id-1"
    })
    edvId: string;
    
    @ApiProperty({
        description: "Keymanagement Service Id",
        example: "hs-kms-id-1"
    })
    kmsId: string;
    constructor(params: {
        userId,
        appName,
        appId,
        appSecret,
        edvId,
        kmsId
    }){
        this.userId = params.userId
        this.appName = params.appName;
        this.appId = params.appId
        this.appSecret = params.appSecret
        this.edvId = params.edvId
        this.kmsId = params.kmsId
    }
}