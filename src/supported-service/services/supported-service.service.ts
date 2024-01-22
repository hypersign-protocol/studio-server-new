import { Injectable } from '@nestjs/common';
import { serviceList } from './service-list';
@Injectable()
export class SupportedServiceService {
  fetchServiceList() {
    return serviceList;
  }
}
