import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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

import { ApiHeader, ApiCreatedResponse, ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

import { Did } from '../schemas/did.schema';
import { AllExceptionsFilter } from '../../utils';
import { SignDidDto } from '../dto/sign-did.dto';
@UseFilters(AllExceptionsFilter)
@ApiTags('Did')
@Controller('did')
@ApiTags('Did')

export class DidController {
  constructor(private readonly didService: DidService) {}
 

  @ApiBearerAuth("Authorization")
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
    description: `Please enter token in following format: Bearer <JWT>`,
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
    description: `Please enter token in following format: Bearer <JWT>`,
    name: 'Authorization',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/sign')
  signDid(@Req() req: any, @Body() signDidDto: SignDidDto) {
    const appDetail = req.user;
    return this.didService.signDid(appDetail, signDidDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDidDto: UpdateDidDto) {
    return this.didService.update(+id, updateDidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.didService.remove(+id);
  }
}
