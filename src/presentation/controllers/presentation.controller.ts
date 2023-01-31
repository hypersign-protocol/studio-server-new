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
import { PresentationRequestService, PresentationService } from '../services/presentation.service';
import { CreatePresentationTemplateDto } from '../dto/create-presentation-templete.dto';
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
import { CreatePresentationRequestDto, CreatePresentationDto, verifiPresntationDto } from '../dto/create-presentation-request.dto';
import { uuid } from 'uuidv4';
import { CredDoc } from 'src/credential/dto/create-credential.dto';






@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation/template')
export class PresentationTempleteController {
  constructor(private readonly presentationService: PresentationService) { }

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

  @Delete(':templateId')
  @ApiOkResponse({
    description: 'Template Deleted Successfully',
    type: PresentationTemplate,
  })
  @ApiNotFoundResponse({
    description: `No resource found for templateId 63d7c558743fea9d22aab...`,
    type: PTemplateNotFoundError,
  })
  remove(@Param('templateId') templateId: string, @Req() req: any) {
    return this.presentationService.deletePresentationTemplate(
      templateId,
      req.user,
    );
  }
}


@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation/request')
export class PresenstationRequsetController {
  constructor(private readonly presentationRequestService:PresentationRequestService){}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  create(
    @Body() createPresentationRequestDto: CreatePresentationRequestDto,
    @Req() req
  ) {
   return this.presentationRequestService.createPresentationRequest(createPresentationRequestDto,req.user)

  }
}





@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation')
export class Presentation {
  constructor(private readonly presentationRequestService:PresentationRequestService ){}
  @Post()
  create(
    @Body()  presentation:CreatePresentationDto,
    @Req() req
  ){

   return this.presentationRequestService.createPresentation(presentation,req.user)
  }



  @Post('/verify')
  verify(
    @Body()  presentation:verifiPresntationDto,
    @Req() req

  ){

    return this.presentationRequestService.verifyPresentation(presentation,req.user)

  }
}

