import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';
import { RegistrationStatus } from '../schemas/did.schema';
import { DidDoc } from '../dto/update-did.dto';

export enum KeyType {
  EcdsaSecp256k1RecoveryMethod2020 = 'EcdsaSecp256k1RecoveryMethod2020',
  Ed25519VerificationKey2020 = 'Ed25519VerificationKey2020',
}

export class Options {
  @ApiProperty({
    description:
      'Verification Method Keytype Ed25519VerificationKey2020 or EcdsaSecp256k1RecoveryMethod2020',
    example: 'keyType:EcdsaSecp256k1RecoveryMethod2020',
    name: 'keyType',
  })
  @IsEnum(KeyType)
  keyType: KeyType;
}
export class CreateDidDto {
  @ApiProperty({
    name: 'namespace',
    description: 'Namespace to be added in did.',
    example: 'testnet',
  })
  @IsString()
  @Trim()
  namespace: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'methodSpecificId',
    description: 'MethodSpecificId to be added in did',
    example: '0x19d73aeeBcc6FEf2d0342375090401301Fe9663F',
    required: false,
  })
  methodSpecificId?: string;

  @ApiProperty({
    name: 'options',
    description: '',
    example: {
      keyType: 'Ed25519VerificationKey2020',
    },
  })
  @Type(() => Options)
  @ValidateNested()
  options: Options;
}

export class TxnHash {
  @ApiProperty({
    name: 'transactionHash',
    description: 'Transaction Has',
    example: 'XYAIFLKFLKHSLFHKLAOHFOAIHG..........',
  })
  transactionHash: string;
}

export class CreateDidResponse {
  @ApiProperty({
    name: 'did',
    description: 'Did document id',
    example: 'did:hid:namespace:.......................',
  })
  did: string;

  @ApiProperty({
    name: 'registrationStatus',
    description: 'Did document registration status',
    example: 'COMPLETED/PROCESSING',
  })
  registrationStatus: RegistrationStatus;

  @ApiProperty({
    name: 'transactionHash',
    description: 'Transaction Has',
    example: 'XYAIFLKFLKHSLFHKLAOHFOAIHG..........',
  })
  @ValidateNested()
  @Type(() => TxnHash)
  transactionHash: TxnHash;

  @ApiProperty({
    name: 'metaData',
    description: 'metaData constaing initial didDocument',
    example: {
      didDocument: {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: 'did:hid:method:......',
        controller: ['did:hid:method:......'],
        alsoKnownAs: ['did:hid:method:......'],
        authentication: ['did:hid:method:......'],
        assertionMethod: ['did:hid:method:......'],
        keyAgreement: ['did:hid:method:......'],
        capabilityInvocation: ['did:hid:method:......'],
        capabilityDelegation: ['did:hid:method:......'],
        service: [
          {
            id: 'did:hid:testnet:.......#linked-domain',
            type: 'LinkedDomains',
            serviceEndpoint:
              'https://example.domain.in/exampleserver/api/v1/org/did:hid:testnet:..........',
          },
        ],
      },
    },
  })
  @ValidateNested()
  @Type(() => DidDoc)
  metaData: { didDocument: DidDoc };
}
