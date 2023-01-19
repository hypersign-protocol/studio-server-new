import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type AppDocument = App & Document;

@Schema()
export class App {
  @ApiHideProperty()
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

  @ApiHideProperty()
  @Prop()
  appSecret: string;

  @ApiProperty({
    description: 'Data Vault Id',
    example: 'hs-edv-id-1',
  })
  @Prop()
  edvId: string;
  @ApiHideProperty()
  @Prop()
  @Exclude()
  edvDocId: string;
  @ApiHideProperty()
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

export class createAppResponse extends App {
  @ApiProperty({
    description: 'Application Secret',
    example: 'app-secret-1',
  })
  @Prop()
  appSecret: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
