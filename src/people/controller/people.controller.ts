import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { PeopleService } from '../services/people.service';
import {
  CreateInviteDto,
  InviteResponseDTO,
  PeopleListResponseDTO,
} from '../dto/create-person.dto';
import { DeletePersonDto, UpdatePersonDto } from '../dto/update-person.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('people')
@ApiBearerAuth('Authorization')
@Controller('/api/v1/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiResponse({
    status: 200,
    description: 'Invite a user to your account',
    type: InviteResponseDTO,
  })
  @Post('/invite')
  @UsePipes(ValidationPipe)
  createInvite(@Body() createInviteDto: CreateInviteDto, @Req() req) {
    const { user } = req;
    return this.peopleService.createInvitation(createInviteDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Accpct invite',
    type: InviteResponseDTO,
  })
  @Post('/invite/accept/:inviteCode')
  @UsePipes(ValidationPipe)
  acceptInvite(@Param('inviteCode') inviteCode: string, @Req() req) {
    const { user } = req;
    return this.peopleService.acceptInvite(inviteCode, user);
  }

  @Patch('invite/:inviteCode')
  @UsePipes(ValidationPipe)
  update(@Param('inviteCode') inviteCode: string, @Req() req) {
    const { user } = req;
    return this.peopleService.update(inviteCode, user);
  }

  @ApiResponse({
    status: 200,
    type: PeopleListResponseDTO,
    isArray: true,
  })
  @Get('/')
  @UsePipes(ValidationPipe)
  async getAllPeople(@Req() req) {
    const { user } = req;

    return this.peopleService.getAllPeople(user);
  }

  @Delete('/')
  @UsePipes(ValidationPipe)
  async deletePeople(@Req() req, @Body() body: DeletePersonDto) {
    const { user } = req;

    return this.peopleService.deletePerson(user, body);
  }
}
