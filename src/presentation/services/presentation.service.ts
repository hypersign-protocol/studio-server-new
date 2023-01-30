import { Injectable } from '@nestjs/common';
import { CreatePresentationTemplateDto } from '../dto/create-presentation.dto';
import { UpdatePresentationDto } from '../dto/update-presentation.dto';

@Injectable()
export class PresentationService {
  createPresentationTemplate(
    createPresentationTemplateDto: CreatePresentationTemplateDto,
    appDetail,
  ) {
    return 'This action adds a new presentation';
  }

  fetchListOfPresentationTemplate() {
    return `This action returns all presentation`;
  }

  fetchAPresentationTemplate(id: number) {
    return `This action returns a #${id} presentation`;
  }

  updatePresentationTemplate(
    id: number,
    updatePresentationDto: UpdatePresentationDto,
  ) {
    return `This action updates a #${id} presentation`;
  }

  deletePresentationTemplate(id: number) {
    return `This action removes a #${id} presentation`;
  }
}
