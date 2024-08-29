import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { RoleRepository } from './repository/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  create(createRole: CreateRoleDTO, user) {
    return this.roleRepository.create({
      userId: user.userId,
      roleName: createRole.roleName,
      permissions: createRole.permissions,
    });
  }

  async findAll(user) {
    return this.roleRepository.find({
      userId: user.userId,
    });
  }

  findOne(id: string, user) {
    return this.roleRepository.findOne({ _id: id, userId: user.userId });
  }

  update(id: string, updateRole: UpdateRoleDTO, user) {
    return this.roleRepository.findOneAndUpdate(
      {
        _id: id,
        userId: user.userId,
      },
      {
        ...updateRole,
      },
    );
  }

  remove(id: string, user) {
    return this.roleRepository.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });
  }
}
