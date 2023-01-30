import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export type PresentationTemplateDocument = PresentationTemplate & Document;
@Schema()
export class PresentationTemplate {
  @IsString()
  @Prop({ required: true })
  appId: string;
  @IsString()
  @Prop({ required: true })
  domain: string;
  @IsString()
  @Prop({ required: true })
  name: string;
  @IsString()
  @Prop({ required: true })
  reason: string;
  @IsString()
  @Prop({ required: false, default: 'QueryByExample' })
  queryType: string;
  @IsString()
  @Prop({ required: true })
  issuerDid: string;
  @IsString()
  @Prop({ required: true })
  schemaId: string;
}

const presentationTemplateSchema =
  SchemaFactory.createForClass(PresentationTemplate);
presentationTemplateSchema.index({ appId: 1, _id: 1 }, { unique: true });
export { presentationTemplateSchema };
