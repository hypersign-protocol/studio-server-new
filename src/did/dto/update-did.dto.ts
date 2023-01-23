import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested, validate } from 'class-validator';






class verificationMethod{
  @ApiProperty({
    description:"Verification Method id",
    example:"did:hid:testnet:z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p#key-1",
       
  })
  @IsString()
  id:string
  @ApiProperty({
    description:"Verification Method type",
    example:"Ed25519VerificationKey2020",
       
  })
  @IsString()
  type:string
  @ApiProperty({
    description:"Verification Method controller",
    example:"did:hid:method:..............",
       
  })
  @IsString()
  controller:string
  @ApiProperty({
    description:"publicKeyMultibase",
    example:"z28ScfSszr2zi2Bd7qmNE4mfHX5j8nCwx4DBF6nAUHu4p",
       
  })
  @IsString()
  publicKeyMultibase:string

  

}

export class DidDoc {
  
  @ApiProperty({
    description:"Context",
    example:["https://www.w3.org/ns/did/v1"]
  })
  @IsArray()
  "@context":Array<string>


  @ApiProperty({
    description:"id",
    example:"did:hid:method:......"
  })
  @IsString()
  id:string
  @ApiProperty({
    description:"Controller",
    example:["did:hid:method:......"]
  })
  @IsArray()
  controller:Array<string>
  @ApiProperty({
    description:"alsoKnownAs",
    example:["did:hid:method:......"]
  })
  @IsArray()
  alsoKnownAs:Array<string>

  @Type(()=>verificationMethod)
  @ValidateNested()
  verificationMethod:Array<verificationMethod>
  @ApiProperty({
    description:"authentication",
    example:["did:hid:method:......"]
  })
  @IsArray()
  authentication:Array<string>
  @ApiProperty({
    description:"assertionMethod",
    example:["did:hid:method:......"]
  })
  @IsArray()
  assertionMethod:Array<string>


  @ApiProperty({
    description:"keyAgreement",
    example:["did:hid:method:......"]
  })
  @IsArray()
  keyAgreement:Array<string>
  @ApiProperty({
    description:"capabilityInvocation",
    example:["did:hid:method:......"]
  })
  @IsArray()
  capabilityInvocation:Array<string>
  @ApiProperty({
    description:"capabilityDelegation",
    example:["did:hid:method:......"]
  })
  @IsArray()
  capabilityDelegation:Array<string>
  @ApiProperty({
    description:"service",
    example:[{
      "id": "did:hid:testnet:.......#linked-domain",
      "type": "LinkedDomains",
      "serviceEndpoint": "https://example.domain.in/exampleserver/api/v1/org/did:hid:testnet:.........."
      }]
  })
  @Type(()=>Service)
  @ValidateNested()
  @IsArray()
  service:Array<Service>


}

class Service{
  @ApiProperty({
    description:"id",
    example:"did:hid:testnet:z23dCariJNNpMNca86EtVZVvrLpn61isd86fWVyWa8Jkm#linked-domain",
       
  })
  @IsString()
  id:string
  @ApiProperty({
    description:"type",
    example:"LinkedDomains",

       
  })
  @IsString()
  type:string
  @ApiProperty({
    description:"serviceEndpoint",
    example:"https://stage.hypermine.in/studioserver/api/v1/org/did:hid:testnet:......................",

       
  })
  @IsString()
  serviceEndpoint:string
  

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
    type:DidDoc
  })


  @Type(()=>DidDoc)
  @ValidateNested()
  didDoc: DidDoc;

  @ApiProperty({
    description: 'Field to check if to deactivate did or to update it ',
    example: false,
  })
  isToDeactivateDid: boolean;
}



