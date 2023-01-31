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
    example: [
      {
        type: 'QueryByExample',
        credentialQuery: [
          {
            required: true,
            reason: 'We need you to prove your eligibility to work.',
            example: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: 'AlumniCredential',
              credentialSubject: {
                name: 'Random name',
                id: 'did:hid:testnet:.............................',
              },
              credentialSchema: {
                id: 'sch:hid:testnet:...............',
                type: 'JsonSchemaValidator2018',
              },
              trustedIssuer: [
                {
                  required: true,
                  issuer: 'did:hid:testnet:................',
                },
              ],
            },
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested()
  @Type(() => Query)
  query: Array<Query>;
}
