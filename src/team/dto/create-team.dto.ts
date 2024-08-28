import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  emailId: string;
}
