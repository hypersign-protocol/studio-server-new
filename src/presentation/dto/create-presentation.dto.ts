import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import {
  CredentialSchema,
  CredentialSubject,
} from 'src/credential/dto/create-credential.dto';
import { IsDid } from 'src/schema/decorator/schema.decorator';
import { ToSnakeCase } from 'src/utils/customDecorator/case.decorator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';
import { queryType } from '../schemas/presentation-template.schema';
export class TruestedIssuer {
  @ApiProperty({
    name: 'required',
    description: 'defining property is required or not',
    example: true,
  })
  @IsBoolean()
  required: boolean;
  @ApiProperty({
    name: 'issuer',
    description: 'did of the issuer',
    example: 'did:hid:testnet:................',
  })
  @IsDid()
  issuer: string;
}

export class QueryExample {
  @ApiProperty({
    name: 'context',
    description: 'Context',
    example: ['https://www.w3.org/2018/credentials/v1'],
  })
  @IsArray()
  '@context': Array<string>;

  @ApiProperty({
    name: 'type',
    description: 'Type of schema used',
    example: 'AdharCard',
  })
  @IsString()
  type: string;

  @ApiProperty({
    name: 'CredentialSubject',
    description: 'Credential subject',
    example: {
      name: 'Random name',
      id: 'did:hid:testnet:.............................',
    },
  })
  @ValidateNested()
  @Type(() => CredentialSubject)
  credentialSubject: CredentialSubject;

  @ApiProperty({
    name: 'credentialSchema',
    description: 'Schema detail based on which credential has issued',
    example: {
      name: 'sch:hid:testnet:...........',
      id: 'JsonSchemaValidator2018',
    },
  })
  @ValidateNested()
  @Type(() => CredentialSchema)
  credentialSchema: CredentialSchema;
  @ApiProperty({
    name: 'trustedIssuer',
    description: 'Specify credentials from a particular issuer only',
    example: {
      required: true,
      issuer: 'did:hid:testnet:................',
    },
  })
  @Type(() => TruestedIssuer)
  @ValidateNested()
  trustedIssuer: Array<TruestedIssuer>;
}

export class CredentialQuery {
  @ApiProperty({
    name: 'required',
    description: 'False by default',
    example: true,
  })
  @IsBoolean()
  required: boolean;
  @ApiProperty({
    name: 'reason',
    description: 'Reason for requesting this credential ',
    example: 'We need you to prove your eligibility to work.',
  })
  @IsString()
  reason: string;
  @ApiProperty({
    name: 'example',
    description:
      'sample detail of credential for which presentation template is to be created',
    example: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: 'AdharCard',
      credentialSubject: {
        name: 'Random name',
        id: 'did:hid:testnet:.............................',
      },
      credentialSchema: {
        name: 'sch:hid:testnet:...........',
        id: 'JsonSchemaValidator2018',
      },
      truestedIssuer: {
        required: true,
        issuer: 'did:hid:testnet:................',
      },
    },
  })
  @ValidateNested()
  @Type(() => QueryExample)
  example: QueryExample;
}
export class Query {
  @ApiProperty({
    name: 'type',
    description: 'Query Type',
    example: 'QueryByExample / DIDAuthentication',
  })
  @IsString()
  type: queryType;

  @ApiProperty({
    name: 'credentialQuery',
    description: 'credentialQuery',
    example: [
      {
        required: true,
        reason: 'We need you to prove your eligibility to work.',
        example: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: 'AdharCard',
          credentialSubject: {
            name: 'Random name',
            id: 'did:hid:testnet:.............................',
          },
          credentialSchema: {
            name: 'sch:hid:testnet:...........',
            id: 'JsonSchemaValidator2018',
          },
          truestedIssuer: {
            required: true,
            issuer: 'did:hid:testnet:................',
          },
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested()
  @Type(() => CredentialQuery)
  credentialQuery: Array<CredentialQuery>;
}
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
              type: 'AdharCard',
              credentialSubject: {
                name: 'Random name',
                id: 'did:hid:testnet:.............................',
              },
              credentialSchema: {
                name: 'sch:hid:testnet:...........',
                id: 'JsonSchemaValidator2018',
              },
              truestedIssuer: {
                required: true,
                issuer: 'did:hid:testnet:................',
              },
            },
          },
        ],
      },
    ],
  })
  @Type(() => Query)
  @ValidateNested()
  query: Query;
}
