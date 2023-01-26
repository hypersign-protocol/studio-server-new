import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CredentialService } from '../services/credential.service';
import { CreateCredentialDto } from '../dto/create-credential.dto';
import { UpdateCredentialDto } from '../dto/update-credential.dto';
import {
  CredentialError,
  CredentialNotFoundError,
} from '../dto/error-credential.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('credential')
@ApiTags('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  @ApiNotFoundResponse({
    status: 404,
    description: 'Error in finding resource',
    type: CredentialNotFoundError,
  })
  @ApiOkResponse({
    description: 'List of credentials',
    type: String,
    isArray: true,
  })
  findAll(@Req() req) {
    return this.credentialService.findAll(req.user);
  }

  @Get(':credentialId')
  @ApiOkResponse({
    description: 'Resolved credential detail',
    // type: ,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'vc:hid:testnet:......',
    type: CredentialNotFoundError,
  })
  resolveCredential(
    @Req() req: any,
    @Param('credentialId') credentialId: string,
  ) {
    const appDetail = req.user;
    return this.credentialService.resolveCredential(credentialId, appDetail);
  }

  @UsePipes(ValidationPipe)
  @Post()
  @ApiCreatedResponse({
    description: 'Credential Created',
    type: Object,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of creating schema',
    type: CredentialError,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Resource not found',
    type: CredentialNotFoundError,
  })
  create(@Body() createCredentialDto: CreateCredentialDto, @Req() req) {
    return this.credentialService.create(createCredentialDto, req.user);
  }

  @Post('/verify')
  verify(@Body() createCredentialDto: CreateCredentialDto, @Req() req) {
    return this.credentialService.create(createCredentialDto, req.user);
  }
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(
  @Param('id') id: string,
  @Body() updateCredentialDto: UpdateCredentialDto,
  @Req() req,
  ) {
    return this.credentialService.update(id, updateCredentialDto,req.user);
  }
}
