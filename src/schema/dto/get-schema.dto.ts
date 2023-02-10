import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Schemas } from '../schemas/schemas.schema';

export class GetSchemaList {
  @ApiProperty({
    description: 'totalCount',
    example: 12,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'data',
    type: Schemas,
    example: ['sch:hid:testnet:............'],
    isArray: true,
  })
  @IsString()
  @IsArray()
  data: Array<Schemas['schemaId']>;
}
