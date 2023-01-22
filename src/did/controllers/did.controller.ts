import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { DidService } from '../services/did.service';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';

import {
  ApiHeader,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Did } from '../schemas/did.schema';
import { AllExceptionsFilter } from '../../utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('Did')
@Controller('did')
@ApiTags('Did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    description: 'Newly created did',
    type: Did,
  })
  create(@Body() createDidDto: CreateDidDto, @Req() req: any) {
    const appDetail = req.user;

    return this.didService.create(createDidDto, appDetail);
  }

  @ApiHeader({
    description: `Please enter token in following format: <JWT>`,
    name: 'Authorization',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiCreatedResponse({
    description: 'Newly created did',
    type: Did,
  })
  getDidList(@Req() req: any): Promise<Did[]> {
    const appDetail = req.user;
    return this.didService.getDidList(appDetail);
  }

  @ApiHeader({
    description: `Please enter token in following format: <JWT>`,
    name: 'Authorization',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':did')
  @ApiResponse({
    description: 'Resolve did ',
    type: Object,
  })
  // To Do remove Object type in did
  resolveDid(@Req() req: any, @Param('did') did: string): Promise<Object> {
    const appDetail = req.user;
    return this.didService.resolveDid(appDetail, did);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':did')
  @ApiResponse({
    description: 'update did detail',
    type: Object,
  })
  updateDid(
    @Req() req: any,
    @Param('did') did: string,
    @Body() updateDidDto: UpdateDidDto,
  ) {
    const appDetail = req.user;
    return this.didService.updateDid(updateDidDto, did, appDetail);
  }
}
