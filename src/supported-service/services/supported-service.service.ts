import { Injectable } from '@nestjs/common';
import { serviceList } from './service-list';
@Injectable()
export class SupportedServiceService {
  fetchServiceList() {
    return serviceList;
  }

  fetchServiceById(id: string) {
    return serviceList.find((service) => service.id === id);
  }
}
