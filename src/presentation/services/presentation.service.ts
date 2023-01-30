import { Injectable } from '@nestjs/common';
import { CreatePresentationTemplateDto } from '../dto/create-presentation.dto';
import { UpdatePresentationDto } from '../dto/update-presentation.dto';
import { PresentationTemplateRepository } from '../repository/presentation-template.repository';
import { Query } from '../schemas/presentation-template.schema';

@Injectable()
export class PresentationService {


  constructor(private readonly presentationtempleteReopsitory:PresentationTemplateRepository){}
  createPresentationTemplate(
    createPresentationTemplateDto: CreatePresentationTemplateDto,
    appDetail,
  ) {

    const {domain,name ,query}=createPresentationTemplateDto
    
    this.presentationtempleteReopsitory.create({
      appId:appDetail.appId,
      domain,
      query,
    })
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
