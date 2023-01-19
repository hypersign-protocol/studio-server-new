import { ApiProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export type AppDocument = App & Document;

@Schema()
export class App {
  @ApiProperty({
    description: 'User DID',
    example: 'did:hid:testnet:123123',
  })
  @Prop()
  @Exclude()
  userId: string;

  @ApiProperty({
    description: 'Application name',
    example: 'demo app',
  })
  @Prop()
  appName: string;

  @ApiProperty({
    description: 'Application id',
    example: 'app-1',
  })
  @Prop()
  appId: string;

  @ApiProperty({
    description: 'Application Secret',
    example: 'app-secret-1',
  })
  @Prop()
  appSecret: string;

  @ApiProperty({
    description: 'Data Vault Id',
    example: 'hs-edv-id-1',
  })
  @Prop()
  edvId: string;

  @ApiProperty({
    description: 'Data Vault Document id',
    example: 'hs-edv-doc-id-1',
  })
  @Prop()
  @Exclude()
  edvDocId: string;

  @ApiProperty({
    description: 'Keymanagement Service Id',
    example: 'hs-kms-id-1',
  })
  @Prop()
  @Exclude()
  kmsId: string;
  @ApiProperty({
    description: 'hid wallet address',
    example: 'hid17wgv5xqdlldvjp3ly4rsl4s48xls0ut4rtvupt',
  })
  @Prop()
  walletAddress: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
