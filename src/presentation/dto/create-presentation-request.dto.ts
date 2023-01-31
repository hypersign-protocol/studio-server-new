import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinDate,
  ValidateNested,
  isURL,
  IsArray,
} from 'class-validator';
import { CredDoc } from 'src/credential/dto/create-credential.dto';
import { IsDid } from 'src/utils/customDecorator/did.decorator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';
import { PresentationTemplate } from '../schemas/presentation-template.schema';

export class CreatePresentationRequestDto {
  @ApiProperty({
    name: 'challenge',
    description: 'Challenge can be used to match the response to a request ',
    example: 'skfdhldklgjh-gaghkdhgaskda-aisgkjheyi',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  challenge: string;

  // verifier DID reference for documentation
  @ApiProperty({
    name: 'did',
    description: 'did of the verifier',
    example: 'did:hid:<namespace>:...............',
  })
  @IsString()
  @IsNotEmpty()
  @IsDid()
  did: string;

  @ApiProperty({
    name: 'templateId',
    description:
      'templateId of the presentation templete to form presentation request',
    example: '6392854982......',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    name: 'expiresTime',
    description: 'expiresTime  for the presentation request (unix timestamp)',
    example: 1231423,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(Number(new Date()))
  expiresTime: number;

  @ApiProperty({
    name: 'callbackUrl',
    description: 'callbackUrl that will receive verifiable presentation',
    example: 'https://example.com/verify/callback',
  })
  @IsUrl()
  @Trim()
  @IsNotEmpty()
  callbackUrl: string;
}

export class CreatePresentationResponseDto {
  @ApiProperty({
    name: 'id',
    description: 'id of presentation request template',
    example: 'f....8-84ae-4..2-a..3-efab....d4db',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
  @ApiProperty({
    name: 'from',
    description: 'did of the holder',
    example: 'did:hid:testnet:...............',
  })
  @IsString()
  @IsNotEmpty()
  @IsDid()
  from: string;
  @ApiProperty({
    name: 'created_time',
    description: 'Time of request creation',
    example: 1675167388737,
  })
  @IsNumber()
  @IsNotEmpty()
  created_time: number;
  @ApiProperty({
    name: 'expires_time',
    description: 'Time at which challenge become invalid',
    example: 1675177277551,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(Number(new Date()))
  expires_time: number;
  @ApiProperty({
    name: 'reply_url',
    description: 'Url that will receive verifiable presentation',
    example: 'https://example.com/verify/callback',
  })
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  reply_url: string;
  @ApiProperty({
    name: 'reply_to',
    description: 'list of dids to whome presentationis to be given',
    example: ['did:hid:testnet:.................'],
  })
  @IsArray()
  reply_to: Array<CreatePresentationRequestDto['did']>;
  @ApiProperty({
    name: 'body',
    description: 'Presentatioin template detail',
    type: PresentationTemplate,
  })
  @IsObject()
  @Type(() => PresentationTemplate)
  @ValidateNested()
  body: PresentationTemplate;
}

export class CreatePresentationDto {
  @ApiProperty({
    name: 'credentials',
    description: 'list of credentials',
    example: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          hs: 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:z3KX4ZqoizKTaED645aV4aE8dBbnSpmQYe3xfzVBJadPY:1.0:',
        },
        {
          name: 'hs:name',
        },
        'https://w3id.org/security/suites/ed25519-2020/v1',
      ],
      id: 'vc:hid:testnet:zE2NevJ8tXJ92fRyCmWXbTJyhzR8GrcqB6FBM24u64LJT',
      type: ['VerifiableCredential', 'nameschema'],
      expirationDate: '2027-12-10T18:30:00Z',
      issuanceDate: '2023-01-26T19:08:59Z',
      issuer: 'did:hid:testnet:zHNL81YLsHxwnCKxK6wyWxoTjt5xi2svw47RdUyPcmCps',
      credentialSubject: {
        name: 'varsha',
        id: 'did:hid:testnet:zHNL81YLsHxwnCKxK6wyWxoTjt5xi2svw47RdUyPcmCps',
      },
      credentialSchema: {
        id: 'sch:hid:testnet:z3KX4ZqoizKTaED645aV4aE8dBbnSpmQYe3xfzVBJadPY:1.0',
        type: 'JsonSchemaValidator2018',
      },
      credentialStatus: {
        id: 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zE2NevJ8tXJ92fRyCmWXbTJyhzR8GrcqB6FBM24u64LJT',
        type: 'CredentialStatusList2017',
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: '2023-01-26T19:10:50Z',
        verificationMethod:
          'did:hid:testnet:zHNL81YLsHxwnCKxK6wyWxoTjt5xi2svw47RdUyPcmCps#key-1',
        proofPurpose: 'assertionMethod',
        proofValue:
          'zEmgea5FY4RkS7scGxE73UgYBskAbAY1CaWRWYwBEd1hh42uWGnJStreWY9Deo8co1zHoFXELWfTXJELR2L8UDsy',
      },
    },
  })
  @ValidateNested()
  @Type(() => CredDoc)
  credentials: [CredDoc];

  @ApiProperty({
    name: 'holderDid',
    description: 'list of credentials',
    example: 'did:hid:testnet:............',
  })
  @IsString()
  @IsDid()
  holderDid: string;

  @ApiProperty({
    name: 'challenge',
    description: 'Challenge can be used to match the response to a request ',
    example: 'skfdhldklgjh-gaghkdhgaskda-aisgkjheyi',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  challenge: string;
  @ApiProperty({
    name: 'domain',
    description: 'domain that will receive verifiable presentation',
    example: 'example.com',
  })
  @Trim()
  @IsNotEmpty()
  domain: string;
}

export class verifyPresentationDto {
  @ApiProperty({
    name: 'presentation',
    description: 'list of credentials',
    example: {},
  })
  @IsObject()
  presentation: object;
}
