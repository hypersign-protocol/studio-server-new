import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type Serivce = {
  id: string;
  dBSuffix: string;
  name: string;
  domain: string;
  description: string;
  swaggerAPIDocPath: string;
};

@Injectable()
export class SupportedServiceList {
  constructor(private readonly config: ConfigService) {}
  getServices(): Array<Serivce> {
    return [
      {
        id: 'SSI_API',
        dBSuffix: 'SSI_API',
        name: 'SSI API Service',
        domain:
          this.config.get('SSI_API_DOMAIN') ||
          'https://api.entity.hypersign.id',
        description: 'A SSI API service built on multi tenant architeacture',
        swaggerAPIDocPath: '/ssi',
      },
      {
        id: 'CAVACH_API',
        dBSuffix: 'CAVACH_API',
        name: 'Cavach API Service',
        domain:
          this.config.get('CAVACH_API_DOMAIN') ||
          'https://api.cavach.hypersign.id',
        description: 'A generic service interface for kyc verification',
        swaggerAPIDocPath: '/api',
      },
    ];
  }
}
