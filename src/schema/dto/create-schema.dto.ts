import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsEmptyTrim, Trim } from '../../utils/customDecorator/trim.decorator';
import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDid } from '../decorator/schema.decorator';
import { ValidateVerificationMethodId } from 'src/utils/customDecorator/vmId.decorator';



// export class Fields{
//   @ApiProperty({
//     name:'name',
//     description:"Name of the field",
//     example:"firstname"
//   })
//   @Prop({isRequired:true})
//   name:string
  
// }
export class SchemaBody {
  @ApiProperty({
    description: 'Name of the schema',
    example: 'Railway ticket schemas',
  })
  @IsString()
  @Trim()
  name: string;

  @ApiProperty({
    description: 'Issuer Did',
    example: 'did:hid:namespace:................',
  })
  @IsString()
  @IsNotEmpty()  
  @IsDid()
  author: string;

  @IsOptional()
  @ApiProperty({
    description: 'description for the schema',
    example: 'Student schema',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'additionalProperties',
    example: false,
  })
  @IsBoolean()
  additionalProperties: boolean;

  @ApiProperty({
    description: 'Schema configuration',
    example: [],
  })
  @IsArray()
  fields: object;
}

export class CreateSchemaDto{

    @ApiProperty({
      name:'schema',
      description:'Schema body',
      example:{
        "name": "testSchema",
        "description": "This is a test schema generation",
        "author": "",
        "fields": [
            {
                "name": "name",
                "type": "string",
                "isRequired": false
            }
        ],
        "additionalProperties": false
    }
    })

    @ValidateNested()
    @Type(()=>SchemaBody)
    schema:SchemaBody

    @ApiProperty({
      name: "namespace",
      description: 'Namespace to be added in did.',
      example: 'testnet',
    })
    @IsString()
    @IsEmptyTrim()
    namespace: string;
    @ApiProperty({
      description: "Verification Method id for did updation",
      example: 'did:hid:testnet:........#key-${idx}'
  
    })
    @ValidateVerificationMethodId()
    @IsString()
    verificationMethodId: string




}


export class createSchemaResponse{
  
  @ApiProperty({
    name:'schemaId',
    description:'Schema id',
    example:'sch:hid:namespce:.....................'
  })
  schemaId:string
  @ApiProperty({
    name:'transactionHash',
    description:'transaction hash for schema',
    example:'KAGSLKAGDLKJGA..................'
  })
  transactionHash:string
  
}