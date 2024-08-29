import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDTO } from './create-role.dto';
import { IsString } from 'class-validator';

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
export class UpdateRoleResponseDTO extends PartialType(CreateRoleDTO) {
  @ApiProperty({
    type: String,
    name: 'userId',
  })
  @IsString()
  userId: string;
}
