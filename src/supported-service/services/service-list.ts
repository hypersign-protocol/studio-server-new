import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SERVICE_TYPES, SERVICES } from './iServiceList';
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
        id: SERVICE_TYPES.SSI_API,
        dBSuffix: SERVICE_TYPES.SSI_API,
        name: 'SSI API Service',
        domain:
          this.config.get('SSI_API_DOMAIN') ||
          'https://api.entity.hypersign.id',
        description: 'A SSI API service built on multi tenant architeacture',
        swaggerAPIDocPath: '/ssi',
      },
      {
        id: SERVICE_TYPES.CAVACH_API,
        dBSuffix: SERVICE_TYPES.CAVACH_API,
        name: 'Cavach API Service',
        domain:
          this.config.get('CAVACH_API_DOMAIN') ||
          'https://api.cavach.hypersign.id',
        description: 'A generic service interface for kyc verification',
        swaggerAPIDocPath: '/api',
      },
    ];
  }

  getDefaultServicesAccess(serviceType: SERVICE_TYPES) {
    const defaultServicesAccess = [];

    if (serviceType == SERVICE_TYPES.SSI_API) {
      // Giving access of SSI service by default
      Object.keys(SERVICES[serviceType].ACCESS_TYPES).forEach((access) => {
        const serviceAccess = {
          serviceType: serviceType,
          access: access,
          expiryDate: null, // never expires
        };
        defaultServicesAccess.push(serviceAccess);
      });
    } else if (serviceType == SERVICE_TYPES.CAVACH_API) {
      Object.keys(SERVICES[serviceType].ACCESS_TYPES).forEach((access) => {
        if (access == SERVICES[serviceType].ACCESS_TYPES.READ_SESSION) {
          return;
        } else if (access == SERVICES[serviceType].ACCESS_TYPES.WRITE_SESSION) {
          return;
        } else if (access == SERVICES[serviceType].ACCESS_TYPES.ALL) {
          return;
        } else {
          const serviceAccess = {
            serviceType: serviceType,
            access: access,
            expiryDate: null, // never expires
          };
          defaultServicesAccess.push(serviceAccess);
        }
      });
    } else {
      throw new Error('Invalid service type: ' + serviceType);
    }
    return defaultServicesAccess;
  }
}
