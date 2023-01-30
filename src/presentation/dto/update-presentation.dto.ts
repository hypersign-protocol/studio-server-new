import { PartialType } from '@nestjs/swagger';
import { CreatePresentationTemplateDto } from './create-presentation.dto';

export class UpdatePresentationDto extends PartialType(CreatePresentationTemplateDto) {}
