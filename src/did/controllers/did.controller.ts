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
import { DidDoc, UpdateDidDto, ResolvedDid } from '../dto/update-did.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';

import { ApiCreatedResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { Did } from '../schemas/did.schema';
import { AllExceptionsFilter } from '../../utils/utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('Did')
@Controller('did')
@ApiTags('Did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({
    description: 'DID List',
    type: String,
    isArray: true,
  })
  getDidList(@Req() req: any): Promise<Did[]> {
    const appDetail = req.user;
    return this.didService.getDidList(appDetail);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Get(':did')
  @ApiResponse({
    description: 'DID Resolved',
    type: ResolvedDid,
  })
  resolveDid(@Req() req: any, @Param('did') did: string): Promise<Object> {
    const appDetail = req.user;
    return this.didService.resolveDid(appDetail, did);
  }

  @UsePipes(ValidationPipe)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    description: 'DID Created',
    type: CreateDidResponse,
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
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  @ApiResponse({
    description: 'DID Updated',
    type: TxnHash,
  })
  updateDid(@Req() req: any, @Body() updateDidDto: UpdateDidDto) {
    const appDetail = req.user;
    return this.didService.updateDid(updateDidDto, appDetail);
  }
}
