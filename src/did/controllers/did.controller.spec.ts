import { Test, TestingModule } from '@nestjs/testing';
import { DidController } from './did.controller';
import { DidService } from '../services/did.service';

describe('DidController', () => {
  let controller: DidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DidController],
      providers: [DidService],
    }).compile();

    controller = module.get<DidController>(DidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
