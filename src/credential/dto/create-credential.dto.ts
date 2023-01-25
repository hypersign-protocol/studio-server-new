import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, isNotEmpty } from "class-validator";
import { IsDid } from "src/schema/decorator/schema.decorator";
import { Trim } from "src/utils/customDecorator/trim.decorator";
import { ValidateVerificationMethodId } from "src/utils/customDecorator/vmId.decorator";

export class CreateCredentialDto {
    @ApiProperty({
        name: 'schemaId',
        description: 'schemaId for credential Schema'
    })
    @IsString()
    @IsNotEmpty()
    schemaId: string

    @ApiProperty({
        name: 'subjectDid',
        description: 'holder did of the credential'
    })
    @IsString()
    @IsDid()
    subjectDid: string
    @ApiProperty({
        name: 'issuerDid',
        description: 'issuerDid of the credential'
    })
    @IsString()
    @IsDid()
    issuerDid: string

    @ApiHideProperty()
    @IsOptional()
    subjectDidDocSigned?: JSON

    @ApiHideProperty()
    @IsOptional()
    schemaContext: Array<string>;
    @ApiHideProperty()
    @IsOptional()
    type: Array<string>;


    @ApiProperty({
        name: 'expirationDate',
        description: "Date in ISOString format",
        example: '2027-12-10T18:30:00.000Z'
    })
    @IsString()
    @IsNotEmpty()
    expirationDate: string;



    @ApiProperty({
        name: 'fields',
        description: 'Credential Data fields',
        example: {
            name: "Random name"
        }
    })
    @IsNotEmptyObject()
    fields: object

    @ApiProperty({
        name: 'namespace',
        description: 'Namespace to be added in did.',
        example: 'testnet',
      })
      @IsString()
      @Trim()
      namespace: string;

      @ApiProperty({
        description: 'Verification Method id for did updation',
        example: 'did:hid:testnet:........#key-${idx}',
      })
      @ValidateVerificationMethodId()
      @IsString()
      verificationMethodId: string;



      @ApiProperty({
        name:'persist',
        description:"Persist in edv",
        example:"true"
      })
      @IsBoolean()
      persist:boolean

}
