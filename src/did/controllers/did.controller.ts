import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseFilters,
  Patch,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { DidService } from '../services/did.service';
import {
  CreateDidDto,
  CreateDidResponse,
  TxnHash,
} from '../dto/create-did.dto';
import { UpdateDidDto, ResolvedDid } from '../dto/update-did.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DidError, DidNotFoundError } from '../dto/error-did.dto';
import { Did } from '../schemas/did.schema';
import { AllExceptionsFilter } from '../../utils/utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('Did')
@Controller('did')
@ApiTags('Did')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard('jwt'))
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'DID List',
    type: String,
    isArray: true,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Error in finding resource',
    type: DidNotFoundError,
  })
  getDidList(@Req() req: any): Promise<Did[]> {
    const appDetail = req.user;
    return this.didService.getDidList(appDetail);
  }
  @Get(':did')
  @ApiResponse({
    status: 200,
    description: 'DID Resolved',
    type: ResolvedDid,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'did:hid:testnet:....... does not exists on chain',
    type: DidNotFoundError,
  })
  resolveDid(@Req() req: any, @Param('did') did: string): Promise<ResolvedDid> {
    const appDetail = req.user;
    return this.didService.resolveDid(appDetail, did);
  }

  @UsePipes(ValidationPipe)
  @Post()
  @ApiCreatedResponse({
    description: 'DID Created',
    type: CreateDidResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of creating schema',
    type: DidError,
  })
  create(@Body() createDidDto: CreateDidDto, @Req() req: any) {
    const { options } = createDidDto;
    const { KeyType } = options;
    if (KeyType === 'EcdsaSecp256k1RecoveryMethod2020') {
      throw new NotFoundException({
        message: [`${KeyType} is not supported`, `Feature coming soon`],
        error: 'Not Supported',
        status: 404,
      });
    }
    const appDetail = req.user;
    return this.didService.create(createDidDto, appDetail);
  }
  @UsePipes(ValidationPipe)
  @Patch()
  @ApiResponse({
    status: 200,
    description: 'DID Updated',
    type: TxnHash,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Invalid didDoc',
    type: DidError,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Resource not found',
    type: DidNotFoundError,
  })
  updateDid(@Req() req: any, @Body() updateDidDto: UpdateDidDto) {
    const appDetail = req.user;
    return this.didService.updateDid(updateDidDto, appDetail);
  }
}
