import { Module } from '@nestjs/common';
import { PresentationService } from './services/presentation.service';
import { PresentationController } from './controllers/presentation.controller';
import {
  PresentationTemplate,
  PresentationTemplateSchema,
} from './schemas/presentation-template.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PresentationTemplateRepository } from './repository/presentation-template.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PresentationTemplate.name,
        schema: PresentationTemplateSchema,
      },
    ]),
  ],
  controllers: [PresentationController],
  providers: [PresentationService, PresentationTemplateRepository],
})
export class PresentationModule {}
