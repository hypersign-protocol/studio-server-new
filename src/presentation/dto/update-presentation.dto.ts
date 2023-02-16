import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ToSnakeCase } from 'src/utils/customDecorator/case.decorator';
import {
  CreatePresentationTemplateDto,
  Query,
} from './create-presentation-templete.dto';

export class UpdatePresentationDto extends PartialType(
  CreatePresentationTemplateDto,
) {
  @ApiProperty({
    name: 'domain',
    description: 'Domain name',
    example: 'fyre.hypersign.id',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  domain: string;
  @ApiProperty({
    name: 'name',
    description: 'name of the presentation template',
    example: 'alumni_credential_request (sanke_case)',
  })
  @IsString()
  @IsNotEmpty()
  @ToSnakeCase()
  name: string;
  @ApiProperty({
    name: 'query',
    description: 'query parameter for requesting presentation',
    type: Query,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => Array<Query>)
  query: Array<Query>;
}
