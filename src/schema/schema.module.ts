import { Module } from '@nestjs/common';
import { SchemaService } from './services/schema.service';
import { SchemaController } from './controllers/schema.controller';

@Module({
  controllers: [SchemaController],
  providers: [SchemaService],
})
export class SchemaModule {}
