import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { PresentationService } from '../services/presentation.service';
import { CreatePresentationTemplateDto } from '../dto/create-presentation.dto';
import { UpdatePresentationDto } from '../dto/update-presentation.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from 'src/utils/utils';
@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation/template')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @UsePipes(new ValidationPipe({transform:true}))
  @Post()
  @ApiCreatedResponse({
    description: 'presentaion template  Created',
    type: CreatePresentationTemplateDto,
  })
  create(
    @Body() createPresentationTemplateDto: CreatePresentationTemplateDto,
    @Req() req: any,
  ) {
    return this.presentationService.createPresentationTemplate(
      createPresentationTemplateDto,
      req.user,
    );
  }

  @Get()
  findAll() {
    return this.presentationService.fetchListOfPresentationTemplate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentationService.fetchAPresentationTemplate(+id);
  }

  @Patch(':id')
  updatePresentationTemplate(
    @Param('id') id: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return this.presentationService.updatePresentationTemplate(
      +id,
      updatePresentationDto,
    );
  }

  remove(@Param('id') id: string) {
    return this.presentationService.deletePresentationTemplate(+id);
  }
}
