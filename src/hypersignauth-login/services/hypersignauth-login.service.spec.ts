import { Test, TestingModule } from '@nestjs/testing';
import { HypersignauthLoginService } from './hypersignauth-login.service';

describe('HypersignauthLoginService', () => {
  let service: HypersignauthLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HypersignauthLoginService],
    }).compile();

    service = module.get<HypersignauthLoginService>(HypersignauthLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
