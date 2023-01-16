import { ApiProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppDocument = App & Document;

@Schema()
export class App {
  @ApiProperty({
    description: 'User DID',
    example: 'did:hid:testnet:123123',
  })
  @Prop()
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
    description: 'Keymanagement Service Id',
    example: 'hs-kms-id-1',
  })
  @Prop()
  kmsId: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
