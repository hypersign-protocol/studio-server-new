import { Test, TestingModule } from '@nestjs/testing';
import { AppAuthController } from './app-auth.controller';

describe('AppAuthController', () => {
  let controller: AppAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppAuthController],
    }).compile();

    controller = module.get<AppAuthController>(AppAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
