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
  HttpCode,
} from '@nestjs/common';
import {
  PresentationRequestService,
  PresentationService,
} from '../services/presentation.service';
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
import {
  CreatePresentationRequestDto,
  CreatePresentationDto,
  CreatePresentationResponse,
  PresentationResponse,
} from '../dto/create-presentation-request.dto';
import { uuid } from 'uuidv4';
import { CredDoc } from 'src/credential/dto/create-credential.dto';
import {
  VerifyPresentationDto,
  VerifyPresentationResponse,
} from '../dto/verify-presentation.dto';

@ApiTags('Presentation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@UseFilters(AllExceptionsFilter)
@Controller('presentation')
export class PresentationTempleteController {
  constructor(
    private readonly presentationService: PresentationService,
    private readonly presentationRequestService: PresentationRequestService,
  ) {}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('template')
  @ApiCreatedResponse({
    description: 'presentaion template  Created',
    type: CreatePresentationTemplateDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'name must be unique for an app',
    type: PTemplateError,
  })
  createPresentationTemplate(
    @Body() createPresentationTemplateDto: CreatePresentationTemplateDto,
    @Req() req: any,
  ): Promise<PresentationTemplate> {
    return this.presentationService.createPresentationTemplate(
      createPresentationTemplateDto,
      req.user,
    );
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('template')
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

  @Get('template/:templateId')
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

  @Patch('template/:templateId')
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

  @Delete('template/:templateId')
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
  @UsePipes(ValidationPipe)
  @Post()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Response of presentation',
    type: PresentationResponse,
  })
  @ApiNotFoundResponse({
    description: 'did:hid:testnet:......#key-${id} not found',
    type: PTemplateNotFoundError,
  })
  create(@Body() presentation: CreatePresentationDto, @Req() req) {
    return this.presentationRequestService.createPresentation(
      presentation,
      req.user,
    );
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('request')
  @ApiCreatedResponse({
    description: 'Presentation request is created',
    type: CreatePresentationResponse,
  })
  @ApiBadRequestResponse({
    description: 'templeteId :62874356...  not found',
    type: PTemplateError,
  })
  createPresentationRequest(
    @Body() createPresentationRequestDto: CreatePresentationRequestDto,
    @Req() req,
  ) {
    return this.presentationRequestService.createPresentationRequest(
      createPresentationRequestDto,
      req.user,
    );
  }
  @UsePipes(ValidationPipe)
  @Post('/verify')
  @ApiOkResponse({
    description: 'presentation verification done successfully',
    type: VerifyPresentationResponse,
  })
  verify(@Body() presentation: VerifyPresentationDto, @Req() req) {
    return this.presentationRequestService.verifyPresentation(
      presentation,
      req.user,
    );
  }
}
