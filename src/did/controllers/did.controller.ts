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
} from '@nestjs/common';
import { DidService } from '../services/did.service';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiCreatedResponse } from '@nestjs/swagger';
import { Did } from '../schemas/did.schema';
@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}
  @ApiHeader({
    description: `Please enter token in following format: Bearer <JWT>`,
    name: 'Authorization',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    description: 'Newly created app',
    type: Did,
  })
  create(@Body() createDidDto: CreateDidDto, @Req() req: any) {
    const appDetail = req.user;
    return this.didService.create(createDidDto, appDetail);
  }

  @Get()
  findAll() {
    return this.didService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.didService.findOne(+id);
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
