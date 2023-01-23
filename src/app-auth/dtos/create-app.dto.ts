import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/customDecorator/trim.decorator';

export class CreateAppDto {
  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @Trim()
  @IsNotEmpty()
  appName: string;
}
