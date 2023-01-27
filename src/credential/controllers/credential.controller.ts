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
  Query,
} from '@nestjs/common';
import { CredentialService } from '../services/credential.service';
import {
  CreateCredentialDto,
  CreateCredentialResponse,
  ResolveCredential,
} from '../dto/create-credential.dto';
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
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/utils/pagination.dto';
import { VerifyCredentialDto } from '../dto/verify-credential.dto';

@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('credential')
@ApiTags('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of credentials',
    type: String,
    isArray: true,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Error in finding resource',
    type: CredentialNotFoundError,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page value',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Fetch limited list of data',
  })
  findAll(
    @Req() req: any,
    @Query() pageOption: PaginationDto,
  ): Promise<string[]> {
    return this.credentialService.findAll(req.user, pageOption);
  }

  @Get(':credentialId')
  @ApiOkResponse({
    description: 'Resolved credential detail',
    type: ResolveCredential,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Credential with id vc:hid:testnet:...... not found',
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
    type: CreateCredentialResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of creating credential',
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

  @UsePipes(ValidationPipe)
  @Post('/verify')
  verify(@Body() verifyCredentialDto: VerifyCredentialDto, @Req() req) {
    return this.credentialService.verfiyCredential(
      verifyCredentialDto,
      req.user,
    );
  }

  @UsePipes(ValidationPipe)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Credential Updated',
    type: ResolveCredential,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'did:hid:testnet:........#key-${idx} not found',
    type: CredentialNotFoundError,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of creating credential',
    type: CredentialError,
  })
  update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
    @Req() req,
  ) {
    return this.credentialService.update(id, updateCredentialDto, req.user);
  }
}
