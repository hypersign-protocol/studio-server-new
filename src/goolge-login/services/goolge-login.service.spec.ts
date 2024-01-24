import { Test, TestingModule } from '@nestjs/testing';
import { GoolgeLoginService } from './goolge-login.service';

describe('GoolgeLoginService', () => {
  let service: GoolgeLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoolgeLoginService],
    }).compile();

    service = module.get<GoolgeLoginService>(GoolgeLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
