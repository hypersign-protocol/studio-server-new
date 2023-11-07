import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrgUser {
  @ApiProperty({
    description: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'password',
  })
  @IsString()
  password: string;
}
