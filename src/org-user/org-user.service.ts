import { Injectable } from '@nestjs/common';
import { CreateOrgUserDto } from './dto/create-org-user.dto';

@Injectable()
export class OrgUserService {
  create(createOrgUserDto: CreateOrgUserDto) {
    return 'This action adds a new orgUser';
  }

  findAll() {
    return `This action returns all orgUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orgUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} orgUser`;
  }
}
