import { Test, TestingModule } from '@nestjs/testing';
import { SupportedServiceService } from './supported-service.service';

describe('SupportedServiceService', () => {
  let service: SupportedServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportedServiceService],
    }).compile();

    service = module.get<SupportedServiceService>(SupportedServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
