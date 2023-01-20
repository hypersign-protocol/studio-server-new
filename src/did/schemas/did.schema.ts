import { ApiProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsOptional } from 'class-validator';

export type DidDocument = Did & Document;

@Schema()
export class Did {
  @ApiProperty({
    description: 'Status of did',
    example: 'Registered',
  })
  @IsOptional()
  @Prop()
  status?: string;

  @ApiProperty({
    description: 'Id of to which particular did is issued',
    example: 'aa4ded21-437e-4215-8792-601ce9ba3de5',
  })
  @Prop()
  appId: string;
  @ApiProperty({
    description: 'Did of user',
    example: 'did:hid:testnet:1234',
  })
  @Prop()
  did: string;
}

export const DidSchema = SchemaFactory.createForClass(Did);
