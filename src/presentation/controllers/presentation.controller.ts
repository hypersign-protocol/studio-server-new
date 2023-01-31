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
  Query,
} from '@nestjs/common';
import { PresentationService } from '../services/presentation.service';
import { CreatePresentationTemplateDto } from '../dto/create-presentation.dto';
import { UpdatePresentationDto } from '../dto/update-presentation.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from 'src/utils/utils';
import { PaginationDto } from 'src/utils/pagination.dto';
import {
  PTemplateError,
  PTemplateNotFoundError,
} from '../dto/error-presentation.dto';
import { PresentationTemplate } from '../schemas/presentation-template.schema';
@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation/template')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @ApiCreatedResponse({
    description: 'presentaion template  Created',
    type: CreatePresentationTemplateDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'name must be unique for an app',
    type: PTemplateError,
  })
  create(
    @Body() createPresentationTemplateDto: CreatePresentationTemplateDto,
    @Req() req: any,
  ): Promise<PresentationTemplate> {
    return this.presentationService.createPresentationTemplate(
      createPresentationTemplateDto,
      req.user,
    );
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  @ApiOkResponse({
    description: 'List of presentation template',
    type: [PresentationTemplate],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'No template has created for appId 42...18-....',
    type: PTemplateNotFoundError,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page value',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Fetch limited list of data',
    required: false,
  })
  fetchListOfPresentationTemplate(
    @Req() req: any,
    @Query() pageOption: PaginationDto,
  ): Promise<PresentationTemplate[]> {
    return this.presentationService.fetchListOfPresentationTemplate(
      pageOption,
      req.user,
    );
  }

  @Get(':templateId')
  @ApiOkResponse({
    description: 'Presentation template detail',
    type: PresentationTemplate,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Resource not found',
    type: PTemplateNotFoundError,
  })
  fetchAPresentationTemplate(
    @Req() req: any,
    @Param('templateId') templateId: string,
  ): Promise<PresentationTemplate> {
    return this.presentationService.fetchAPresentationTemplate(
      templateId,
      req.user,
    );
  }

  @Patch(':templateId')
  @ApiOkResponse({
    description: 'Template Updated',
    type: PresentationTemplate,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of updating',
    type: PTemplateError,
  })
  updatePresentationTemplate(
    @Req() req: any,
    @Param('templateId') templateId: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return this.presentationService.updatePresentationTemplate(
      templateId,
      updatePresentationDto,
      req.user,
    );
  }

  // remove(@Param('id') id: string) {
  //   return this.presentationService.deletePresentationTemplate(+id);
  // }
}
