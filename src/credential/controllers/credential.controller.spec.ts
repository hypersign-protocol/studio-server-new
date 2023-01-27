import { Test, TestingModule } from '@nestjs/testing';
import { CredentialController } from './credential.controller';
import { CredentialService } from './services/credential.service';

describe('CredentialController', () => {
  let controller: CredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialController],
      providers: [CredentialService],
    }).compile();

    controller = module.get<CredentialController>(CredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
