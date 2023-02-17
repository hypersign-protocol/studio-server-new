import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Credential } from '../schemas/credntial.schema';

export class GetCredentialList {
  @ApiProperty({
    description: 'totalCount',
    example: 12,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'data',
    type: Credential,
    example: ['vc:hid:testnet:............'],
    isArray: true,
  })
  @IsString()
  @IsArray()
  data: Array<Credential['credentialId']>;
}
