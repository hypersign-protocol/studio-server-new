import { ApiProperty } from '@nestjs/swagger';
import { DidDoc } from './update-did.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateVerificationMethodId } from 'src/utils/customDecorator/vmId.decorator';

export enum IClientSpec {
  'eth-personalSign' = 'eth-personalSign',
  'cosmos-ADR036' = 'cosmos-ADR036',
}
export class RegisterDidDto {
  @ApiProperty({
    description: 'Did doc to be registered',
    type: DidDoc,
    required: true,
  })
  @IsNotEmptyObject()
  @Type(() => DidDoc)
  @ValidateNested({ each: true })
  didDocument: DidDoc;

  @ApiProperty({
    description: 'Verification Method id for did registration',
    example: 'did:hid:testnet:........#key-${idx}',
    required: true,
  })
  @ValidateVerificationMethodId()
  @IsString()
  @Matches(/^[a-zA-Z0-9\:]*testnet[a-zA-Z0-9\-:#]*$/, {
    message: "Did's namespace should be testnet",
  }) // this is to validate if did is generated using empty namespace
  verificationMethodId: string;

  @ApiProperty({
    description: "IClientSpec  'eth-personalSign' or  'cosmos-ADR036'",
    example: 'eth-personalSign',
    name: 'clientSpec',
    required: false,
  })
  @IsOptional()
  @IsEnum(IClientSpec)
  clientSpec?: IClientSpec;

  @ApiProperty({
    description: 'Signature for clientSpec',
    example: 'afafljagahgp9agjagknaglkj/kagka=',
    name: 'signature',
    required: false,
  })
  @ValidateIf((o, value) => o.clientSpec !== undefined)
  @IsNotEmpty()
  @IsString()
  signature?: string;
  // @ApiProperty({
  //   description: 'Checksum address from web3 wallet',
  //   example: 'hid148273582',
  //   name: 'address',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // address?: string;
}
