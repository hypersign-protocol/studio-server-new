import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAlpha, IsAlphanumeric, IsArray, IsNotEmpty, IsObject, IsString, ValidateNested, validate } from 'class-validator';
import { ValidateVerificationMethodId } from '../decorator/did.decorator';
import { DidMetaData } from '../schemas/did.schema';






class verificationMethod {
  @ApiProperty({
    description: "Verification Method id",
    example: "did:hid:testnet:z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p#key-1",

  })
  @IsString()
  id: string
  @ApiProperty({
    description: "Verification Method type",
    example: "Ed25519VerificationKey2020",

  })
  @IsString()
  type: string
  @ApiProperty({
    description: "Verification Method controller",
    example: "did:hid:method:..............",

  })
  @IsString()
  controller: string
  @ApiProperty({
    description: "publicKeyMultibase",
    example: "z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p",

  })
  @IsString()
  publicKeyMultibase: string



}

export class DidDoc {

  @ApiProperty({
    description: "Context",
    example: ["https://www.w3.org/ns/did/v1"]
  })
  @IsArray()
  "@context": Array<string>


  @ApiProperty({
    description: "id",
    example: "did:hid:method:......"
  })
  @IsString()
  id: string
  @ApiProperty({
    description: "Controller",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  controller: Array<string>
  @ApiProperty({
    description: "alsoKnownAs",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  alsoKnownAs: Array<string>

  @Type(() => verificationMethod)
  @ValidateNested()
  verificationMethod: Array<verificationMethod>
  @ApiProperty({
    description: "authentication",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  authentication: Array<string>
  @ApiProperty({
    description: "assertionMethod",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  assertionMethod: Array<string>


  @ApiProperty({
    description: "keyAgreement",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  keyAgreement: Array<string>
  @ApiProperty({
    description: "capabilityInvocation",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  capabilityInvocation: Array<string>
  @ApiProperty({
    description: "capabilityDelegation",
    example: ["did:hid:method:......"]
  })
  @IsArray()
  capabilityDelegation: Array<string>
  @ApiProperty({
    description: "service",
    example: [{
      "id": "did:hid:testnet:.......#linked-domain",
      "type": "LinkedDomains",
      "serviceEndpoint": "https://example.domain.in/exampleserver/api/v1/org/did:hid:testnet:.........."
    }]
  })
  @Type(() => Service)
  @ValidateNested()
  @IsArray()
  service: Array<Service>


}

export class DidDocumentMetaData {
  @ApiProperty({
    name:"created",
    example:"2023-01-23T13:45:17Z"
  })
  created:string
  @ApiProperty({
    name:"updated",
    example:"2023-01-23T13:45:17Z"
  })
  updated:string
  @ApiProperty({
    name:"deactivated",
    example:"false"
  })
  deactivated:boolean
  @ApiProperty({
    name:"versionId",
    example:"095A65E4D2F9CA2AACE0D17A28883A0E5DDC1BBE1C9BF9D............."
  })
  versionId:string
  
}

export class ResolvedDid{
  @ApiProperty({
    name:"didDocument",
    description:"Resolved Did Document",
    example:DidDoc
    
  })

  didDocument:DidDoc
  @ApiProperty({
    name:"didDocumentMetadata",
    description:"Resolved didDocumentMetadata",
    example:DidDoc
    
  })

  didDocumentMetadata:DidDocumentMetaData

}







class Service {
  @ApiProperty({
    description: "id",
    example: "did:hid:testnet:z23dCariJNNpMNca86EtVZVvrLpn61isd86fWVyWa8Jkm#linked-domain",

  })
  @IsString()
  id: string
  @ApiProperty({
    description: "type",
    example: "LinkedDomains",


  })
  @IsString()
  type: string
  @ApiProperty({
    description: "serviceEndpoint",
    example: "https://stage.hypermine.in/studioserver/api/v1/org/did:hid:testnet:......................",


  })
  @IsString()
  serviceEndpoint: string


}
export class UpdateDidDto {
  @ApiProperty({
    description: 'Did doc to be updated',
    example: {
      "@context": [
        "https://www.w3.org/ns/did/v1"
      ],
      "id": "did:hid:method:......",
      "controller": [
        "did:hid:method:......"
      ],
      "alsoKnownAs": [
        "did:hid:method:......"
      ],
      "authentication": [
        "did:hid:method:......"
      ],
      "assertionMethod": [
        "did:hid:method:......"
      ],
      "keyAgreement": [
        "did:hid:method:......"
      ],
      "capabilityInvocation": [
        "did:hid:method:......"
      ],
      "capabilityDelegation": [
        "did:hid:method:......"
      ],
      "service": [
        {
          "id": "did:hid:testnet:.......#linked-domain",
          "type": "LinkedDomains",
          "serviceEndpoint": "https://example.domain.in/exampleserver/api/v1/org/did:hid:testnet:.........."
        }
      ]
    },
    type: DidDoc
  })


  @Type(() => DidDoc)
  @ValidateNested()
  didDoc: DidDoc;

  @ApiProperty({
    description: 'Field to check if to deactivate did or to update it ',
    example: false,
  })
  isToDeactivateDid: boolean;
  @ApiProperty({
    description: "Verification Method id for did updation",
    example: 'did:hid:testnet:........#key-${idx}'

  })
  @ValidateVerificationMethodId()
  @IsString()
  verificationMethodId: string
}



