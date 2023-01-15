import { Test, TestingModule } from '@nestjs/testing';
import { AppAuthService } from './app-auth.service';

describe('AppAuthService', () => {
  let service: AppAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppAuthService],
    }).compile();

    service = module.get<AppAuthService>(AppAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
