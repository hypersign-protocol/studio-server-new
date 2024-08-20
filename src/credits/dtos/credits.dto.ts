import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCreditsDto {
  @ApiProperty({
    name: 'appId',
    default: 'appId',
  })
  @IsNotEmpty()
  @IsString()
  appId: string;
}
