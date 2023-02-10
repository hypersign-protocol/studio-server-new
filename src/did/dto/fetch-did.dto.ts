import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Did } from '../schemas/did.schema';

export class GetDidList {
  @ApiProperty({
    description: 'totalCount',
    example: 12,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'data',
    type: Did,
    example: ['did:hid:testnet:............'],
    isArray: true,
  })
  @IsString()
  @IsArray()
  data: Array<Did['did']>;
}
