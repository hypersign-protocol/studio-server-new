import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';

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

  @ApiProperty({
    description: 'description',
    example: 'Example description',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Prop()
  description: string;
  @ApiProperty({
    description: 'whitelistedCors',
    example: ['https://example.com'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @Prop()
  whitelistedCors: Array<string>;
  @ApiProperty({
    description: 'logoUrl',
    example: 'http://image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Prop({ isRequired: false })
  logoUrl?: string;
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
