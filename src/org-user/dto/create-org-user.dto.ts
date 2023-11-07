import { ApiProperty } from '@nestjs/swagger';

export class CreateOrgUserDto {
  @ApiProperty({
    description: 'Super Admin user name',
  })
  username: string;

  @ApiProperty({
    description: 'Super Admin user name',
  })
  password: string;
}

export class LoginOrgUserResponseDto {
  @ApiProperty({
    description: 'User logged in!',
  })
  message: string;
}
