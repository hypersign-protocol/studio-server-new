import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CredDoc, CredentialProof } from './create-credential.dto';

export class VerifyCredentialDto {
  @ApiProperty({
    name: 'credential',
    description: 'credential document',
  })
  @ValidateNested()
  @Type(() => CredDoc)
  credential: CredDoc;
}
class StatusResult {
  @ApiProperty({
    name: 'verified',
    description: 'verification result',
    example: true,
  })
  verified: boolean;
}

class proof extends CredentialProof {
  @ApiProperty({
    name: 'Context',
    description: '',
    example: [
      'https://www.w3.org/2018/credentials/v1',
      {
        hs: 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:z3KX4ZqoizKTaED645aV4aE8dBbnSpmQYe3xfzVBJadPY:1.0:',
      },
      {
        name: 'hs:name',
      },
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
  })
  '@context': Array<string>;
}
class PurposeResult {
  @ApiProperty({
    name: 'valid',
    description: '',
    example: true,
  })
  valid: boolean;
}
class verificationMethod {
  @ApiProperty({
    description: 'Verification Method id',
    example:
      'did:hid:testnet:z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p#key-1',
  })
  @IsString()
  id: string;
  @ApiProperty({
    description: 'Verification Method type',
    example: 'Ed25519VerificationKey2020',
  })
  @IsString()
  type: string;
  @ApiProperty({
    description: 'Verification Method controller',
    example: 'did:hid:method:..............',
  })
  @IsString()
  controller: string;
  @ApiProperty({
    description: 'publicKeyMultibase',
    example: 'z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p',
  })
  @IsString()
  publicKeyMultibase: string;
}

class Result {
  @ApiProperty({
    name: 'proof',
    description: '',
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
      type: 'Ed25519Signature2020',
      created: '2023-01-25T17:01:02Z',
      verificationMethod: 'did:hid:testnet:...............#key-${id}',
      proofPurpose: 'assertionMethod',
      proofValue:
        'z5LairjrBYkc5FtPWeDVuLdQUzpMTBULcp3Q5YDnrLh63UuBuY6BpdiQYhTEcKBFW76TEXFHm37aDvcMtCvnYfmvQ',
    },
  })
  @Type(() => proof)
  @ValidateNested()
  'proof': proof;
  @ApiProperty({
    name: 'verified',
    description: 'proof verification result',
    example: true,
  })
  verified: boolean;
  @ApiProperty({
    name: 'verified',
    description: 'proof verification result',
    example: {
      id: 'did:hid:testnet:..................#key-${id}',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:hid:testnet:........................',
      publicKeyMultibase: 'z6MkvpbAbn..................k8LZKFMdgRcF',
    },
  })
  @Type(() => verificationMethod)
  @ValidateNested()
  verificationMethod: verificationMethod;
  @Type(() => PurposeResult)
  @ValidateNested()
  @ApiProperty({
    name: 'verified',
    description: 'proof verification result',
    example: true,
  })
  purposeResult: PurposeResult;
}
export class VerifyCredentialResponse {
  @ApiProperty({
    name: 'verified',
    description: 'result of credential verification',
  })
  verified: boolean;

  @ApiProperty({
    name: 'results',
    description: 'Verification detail of proof ',
    example: [
      {
        proof: {
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
          type: 'Ed25519Signature2020',
          created: '2023-01-25T17:01:02Z',
          verificationMethod:
            'did:hid:testnet:........................#key-${id}',
          proofPurpose: 'assertionMethod',
          proofValue: 'z5LairjrBYkc5FtPW............................nYfmvQ',
        },
        verified: true,
        verificationMethod: {
          id: 'did:hid:testnet:..........................#key-${id}',
          type: 'Ed25519VerificationKey2020',
          controller: 'did:hid:testnet:.............................',
          publicKeyMultibase: 'z6Mkvpb.....................FMdgRcF',
        },
        purposeResult: {
          valid: true,
        },
      },
    ],
  })
  results: Array<Result>;
  @Type(() => StatusResult)
  @ValidateNested()
  @ApiProperty({
    name: 'statusResult',
    description: 'Verification result',
    example: {
      verified: false,
    },
  })
  statusResult: StatusResult;
}
