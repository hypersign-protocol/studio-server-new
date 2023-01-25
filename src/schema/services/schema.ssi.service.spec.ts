import { Test, TestingModule } from '@nestjs/testing';
import { SchemaSSIService } from './schema.ssi.service';

describe('SchemaSSIService', () => {
  let service: SchemaSSIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemaSSIService],
    }).compile();

    service = module.get<SchemaSSIService>(SchemaSSIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
