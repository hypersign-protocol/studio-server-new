import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Document } from 'mongoose';
import {
  CredentialSchema,
  CredentialSubject,
} from 'src/credential/dto/create-credential.dto';
import { ToPascalCase } from 'src/utils/customDecorator/case.decorator';
import { IsDid } from 'src/utils/customDecorator/did.decorator';

export type PresentationTemplateDocument = PresentationTemplate & Document;

export enum queryType {
  QueryByExample = 'QueryByExample',
  QueryByFrame = 'QueryByFrame',
  DIDAuthentication = 'DIDAuthentication',
}
export class Query {
  @ApiProperty({
    name: 'type',
    description: 'Query Type',
    example: 'QueryByExample / DIDAuthentication',
  })
  @IsString()
  @ToPascalCase()
  @Prop()
  @IsEnum(queryType)
  type: queryType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CredentialQuery)
  @Prop({ required: true })
  credentialQuery: Array<CredentialQuery>;
}

export class TrustedIssuer {
  @IsBoolean()
  @Prop()
  required: boolean;
  @IsDid()
  @IsString()
  @Prop()
  issuer: string;
}

export class QueryExample {
  @IsArray()
  @Prop()
  '@context': Array<string>;

  @IsString()
  @ToPascalCase()
  @Prop()
  type: string;

  @ValidateNested()
  @Type(() => CredentialSubject)
  @Prop({ required: false })
  credentialSubject: CredentialSubject;

  @ValidateNested()
  @Type(() => CredentialSchema)
  @Prop({ required: false })
  credentialSchema: CredentialSchema;

  @Type(() => Array<TrustedIssuer>)
  @ValidateNested({ each: true })
  @Prop()
  trustedIssuer: Array<TrustedIssuer>;
}

export class CredentialQuery {
  @IsBoolean()
  @Prop({ required: false, default: true })
  required: boolean;

  @IsString()
  @Prop({ required: false, default: 'We need you to prove your eligibility..' })
  reason: string;

  @ValidateNested()
  @Type(() => QueryExample)
  @Prop()
  example: QueryExample;
}

@Schema()
export class PresentationTemplate {
  @ApiProperty({
    description: 'Application Id',
    example: '43...18-...........',
  })
  @IsString()
  @Prop({ required: true })
  appId: string;
  @ApiProperty({
    description: 'Domain name',
    example: 'fyre.hypersign.id',
  })
  @IsString()
  @IsUrl({ protocols: ['http', 'https'] })
  @Prop({ required: true })
  domain: string;
  @ApiProperty({
    description: 'Domain name',
    type: Query,
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
  @ValidateNested({ each: true })
  @Type(() => Array<Query>)
  @Prop({ required: true })
  query: Array<Query>;
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

const PresentationTemplateSchema =
  SchemaFactory.createForClass(PresentationTemplate);
PresentationTemplateSchema.index({ appId: 1, _id: 1 }, { unique: true });
export { PresentationTemplateSchema };
