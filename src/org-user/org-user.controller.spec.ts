import { Test, TestingModule } from '@nestjs/testing';
import { OrgUserController } from './org-user.controller';
import { OrgUserService } from './org-user.service';

describe('OrgUserController', () => {
  let controller: OrgUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgUserController],
      providers: [OrgUserService],
    }).compile();

    controller = module.get<OrgUserController>(OrgUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
