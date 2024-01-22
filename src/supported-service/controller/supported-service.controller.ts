import { Controller, Get, UseFilters, Logger } from '@nestjs/common';
import { SupportedServiceService } from '../services/supported-service.service';
import { supportedServiceResponseDto } from '../dto/create-supported-service.dto';
import { AllExceptionsFilter } from 'src/utils/utils';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@UseFilters(AllExceptionsFilter)
@ApiTags('Application')
@Controller('/api/v1/services')
export class SupportedServiceController {
  constructor(
    private readonly supportedServiceService: SupportedServiceService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Service List',
    type: supportedServiceResponseDto,
    isArray: true,
  })
  findAll() {
    Logger.log('findAll() method: start', 'SupportedServiceController');
    return this.supportedServiceService.fetchServiceList();
  }
}
