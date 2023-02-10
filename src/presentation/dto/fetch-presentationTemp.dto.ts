import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { PresentationTemplate } from '../schemas/presentation-template.schema';

export class GetPresentationTemplateListList {
  @ApiProperty({
    description: 'totalCount',
    example: 12,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'data',
    type: PresentationTemplate,
    isArray: true,
  })
  @IsString()
  @IsArray()
  data: Array<PresentationTemplate>;
}
