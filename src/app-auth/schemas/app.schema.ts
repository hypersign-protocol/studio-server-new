import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  appName: string;

  @ApiProperty({
    description: 'Application id',
    example: 'app-1',
  })
  @Prop({ required: false })
  appId: string;

  @ApiHideProperty()
  @Prop()
  apiKeySecret: string;

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

  //@ApiHideProperty()
  @Prop()
  //@Exclude()
  @ApiProperty({
    description: 'Key Manager Service Id',
    example: 'KMS Id for this application',
  })
  kmsId: string;

  @ApiHideProperty()
  @Prop()
  apiKeyPrefix: string;
  @ApiProperty({
    description: 'hid wallet address',
    example: 'hid17wgv5xqdlldvjp3ly4rsl4s48xls0ut4rtvupt',
  })
  @Prop()
  walletAddress: string;

  @ApiProperty({
    description: 'description',
    example: 'Example description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Prop({ required: false })
  description: string;

  @ApiProperty({
    description: 'whitelistedCors',
    example: ['https://example.com'],
    isArray: true,
  })
  @IsArray()
  @Prop({ required: false })
  whitelistedCors: Array<string>;

  @ApiProperty({
    description: 'logoUrl',
    example: 'http://image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Prop({ required: false })
  logoUrl: string;
}

export class createAppResponse extends App {
  @ApiProperty({
    description: 'Application Secret',
    example: 'app-secret-1',
  })
  @Prop()
  apiKeySecret: string;
}

export const AppSchema = SchemaFactory.createForClass(App);

AppSchema.index({ apiKeyPrefix: 1, apiKeySecret: 1 }, { unique: true });
AppSchema.index({ appId: 1 }, { unique: true });
AppSchema.index({ appId: 1, walletAddress: 1, edvId: 1 }, { unique: true });
