import { Test, TestingModule } from '@nestjs/testing';
import { GoolgeLoginController } from './goolge-login.controller';
import { GoolgeLoginService } from '../services/goolge-login.service';

describe('GoolgeLoginController', () => {
  let controller: GoolgeLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoolgeLoginController],
      providers: [GoolgeLoginService],
    }).compile();

    controller = module.get<GoolgeLoginController>(GoolgeLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
