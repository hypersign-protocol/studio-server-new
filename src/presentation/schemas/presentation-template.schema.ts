import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsObject, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { CreateCredentialDto, CredentialSchema, CredentialSubject } from 'src/credential/dto/create-credential.dto';
import { IsDid } from 'src/schema/decorator/schema.decorator';
import { ToPascalCase } from 'src/utils/customDecorator/case.decorator';

export type PresentationTemplateDocument = PresentationTemplate & Document;





export enum queryType {
  QueryByExample = "QueryByExample",
  QueryByFrame = "QueryByFrame",
  DIDAuthentication = "DIDAuthentication"
}
export class Query {
  @ApiProperty({
    name: "type",
    description: "Query Type",
    example: "QueryByExample / DIDAuthentication"
  })
  @IsString()
  @ToPascalCase()
  @Prop()
  @IsEnum(queryType)
  type: queryType


  @IsArray()
  @ValidateNested()
  @Type(() => CredentialQuery)
  @Prop({ required: true })
  credentialQuery: Array<CredentialQuery>



}

export class TruestedIssuer {

  @IsBoolean()
  @Prop()
  required: boolean
  @IsDid()
  @Prop()
  issuer: string
}

export class QueryExample {


  @IsArray()
  @Prop()
  "@context": Array<String>

  @IsString()
  @ToPascalCase()
  @Prop()
  type: string

  @ValidateNested()
  @Type(() => CredentialSubject)
  @Prop({ required: false })
  credentialSubject: CredentialSubject



  @ValidateNested()
  @Type(() => CredentialSchema)
  @Prop({ required: false })
  credentialSchema: CredentialSchema


  @Type(() => TruestedIssuer)
  @ValidateNested()
  @Prop()
  trustedIssuer: Array<TruestedIssuer>



}

export class CredentialQuery {


  @IsBoolean()
  @Prop({ required: false, default: true })
  required: boolean

  @IsString()
  @Prop({ required: false, default: "We need you to prove your eligibility.." })
  reason: string

  @ValidateNested()
  @Type(() => QueryExample)
  @Prop()
  example: QueryExample



}




@Schema()
export class PresentationTemplate {
  @IsString()
  @Prop({ required: true })
  appId: string;


  @IsString()
  @IsUrl({ protocols: ['http', 'https'] })
  @Prop({ required: true })
  domain: string;

  @IsString()
  @Prop({ required: true })
  challenge: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Query)
  @Prop({ required: true })
  query: Array<Query>
}



const presentationTemplateSchema =
  SchemaFactory.createForClass(PresentationTemplate);
presentationTemplateSchema.index({ appId: 1, _id: 1 }, { unique: true });
export { presentationTemplateSchema };
