import { Module } from '@nestjs/common';
import { PresentationService } from './services/presentation.service';
import { PresentationController } from './controllers/presentation.controller';

@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
})
export class PresentationModule {}
