import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { ToSnakeCase } from 'src/utils/customDecorator/case.decorator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';
import { Query } from '../schemas/presentation-template.schema';

export class CreatePresentationTemplateDto {
  @ApiProperty({
    name: 'domain',
    description: 'Domain name',
    example: 'fyre.hypersign.id',
  })
  // add chek for valid domain
  @IsString()
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'] })
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

  @ValidateNested()
  @Type(() => Query)
  query: Array<Query>

}
