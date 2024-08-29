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
} from '@nestjs/common';
import { RoleService } from '../role.service';
import { CreateRoleDTO, CreateRoleResponseDTO } from '../dto/create-role.dto';
import { UpdateRoleDTO, UpdateRoleResponseDTO } from '../dto/update-role.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
import { UserRepository } from 'src/user/repository/user.repository';

@UseFilters(AllExceptionsFilter)
@ApiTags('Roles')
@ApiBearerAuth('Authorization')
@Controller('api/v1/roles')
export class TeamController {
  constructor(
    private readonly roleSerive: RoleService,
    private readonly userRepository: UserRepository,
  ) {}

  @ApiResponse({
    type: CreateRoleResponseDTO,
    description: 'Role List',
    status: 200,
  })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createRole: CreateRoleDTO, @Req() req) {
    const { user } = req;

    return this.roleSerive.create(createRole, user);
  }

  // @Post('/add/member')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async addTeamMember() {}
  @ApiResponse({
    type: CreateRoleResponseDTO,
    description: 'Role List',
    isArray: true,
    status: 200,
  })
  @Get()
  findAll(@Req() req) {
    const { user } = req;

    return this.roleSerive.findAll(user);
  }

  @ApiResponse({
    type: CreateRoleResponseDTO,
    description: 'Role List',
    status: 200,
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req): Promise<CreateRoleResponseDTO> {
    const { user } = req;
    return this.roleSerive.findOne(id, user);
  }
  @ApiResponse({
    type: UpdateRoleResponseDTO,
    description: 'Role List',
    status: 200,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRole: UpdateRoleDTO,
    @Req() req,
  ): Promise<UpdateRoleResponseDTO> {
    const { user } = req;

    return this.roleSerive.update(id, updateRole, user);
  }
  @ApiResponse({
    type: CreateRoleResponseDTO,
    description: 'Role List',
    status: 200,
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const { user } = req;

    return this.roleSerive.remove(id, user);
  }
}
