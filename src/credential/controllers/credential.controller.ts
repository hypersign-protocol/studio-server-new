import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { CredentialService } from '../services/credential.service';
import { CreateCredentialDto } from '../dto/create-credential.dto';
import { UpdateCredentialDto } from '../dto/update-credential.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('credential')
@ApiTags('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  findAll(@Req() req) {
    
    return this.credentialService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialService.findOne(+id);
  }


  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto,@Req() req) {    
    return this.credentialService.create(createCredentialDto,req.user);
  }

  @Post('/verify')
  verify(@Body() createCredentialDto: CreateCredentialDto,@Req() req) {
    return this.credentialService.create(createCredentialDto,req.user);
  }
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCredentialDto: UpdateCredentialDto,@Req() req) {
    return this.credentialService.update(id, updateCredentialDto,req.user);
  }
}
