import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Req,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
import { UserRepository } from 'src/user/repository/user.repository';

@UseFilters(AllExceptionsFilter)
@ApiTags('Teams')
@ApiBearerAuth('Authorization')
@Controller('api/v1/teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTeamDto: CreateTeamDto, @Req() req) {
    const { user } = req;
    const toTeamInviteUser = await this.userRepository.findOne({
      email: createTeamDto.emailId,
    });
    if (toTeamInviteUser == null) {
      throw new BadRequestException(
        'User not found with emailId ' + createTeamDto.emailId,
      );
    }
    return this.teamService.create(createTeamDto, user);
  }

  @Post('/add/member')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async addTeamMember() {}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
