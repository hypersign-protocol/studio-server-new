import { Test, TestingModule } from '@nestjs/testing';
import { DidSSIService} from '../services/did.ssi.service';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';

describe('DidSSIService', () => {
  let service: DidSSIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DidSSIService],
      
      
    }).compile();

    service = module.get<DidSSIService>(DidSSIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
