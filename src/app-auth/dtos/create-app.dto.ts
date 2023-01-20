import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @IsNotEmpty()
  appName: string;
}
