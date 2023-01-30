import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from '../controllers/presentation.controller';
import { PresentationService } from '../services/presentation.service';

describe('PresentationController', () => {
  let controller: PresentationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [PresentationService],
    }).compile();

    controller = module.get<PresentationController>(PresentationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
