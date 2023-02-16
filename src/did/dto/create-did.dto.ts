import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RegistrationStatus } from '../schemas/did.schema';
import { DidDoc } from '../dto/update-did.dto';
import { IsDid } from 'src/utils/customDecorator/did.decorator';
import { Optional } from '@nestjs/common';

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
  @ValidateIf((o) => o.keyType !== undefined)
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
  @IsNotEmpty()
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
    description: ' keyType used for verification',
    example: {
      keyType: 'Ed25519VerificationKey2020',
    },
  })
  @IsOptional()
  @IsObject()
  @Type(() => Options)
  @ValidateNested({
    each: true,
  })
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
  @IsString()
  @IsDid()
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
    type: DidDoc,
  })
  @ValidateNested()
  @Type(() => DidDoc)
  metaData: { didDocument: DidDoc };
}
