import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, Min, MinDate, ValidateNested, isURL } from "class-validator";
import { CredDoc } from "src/credential/dto/create-credential.dto";
import { IsDid } from "src/schema/decorator/schema.decorator";
import { Trim } from "src/utils/customDecorator/trim.decorator";


export class CreatePresentationRequestDto{


    @ApiProperty({
        name:'challenge',
        description:"Challenge can be used to match the response to a request ",
        example:"skfdhldklgjh-gaghkdhgaskda-aisgkjheyi"
    })

    @IsString()
    @Trim()
    @IsNotEmpty()
    challenge:string
    
    // verifier DID reference for documentation
    @ApiProperty({
        name:'did',
        description:"did of the verifier",
        example:"did:hid:<namespace>:..............."
    })

    @IsString()
    @IsNotEmpty()
    @IsDid()
    did:string


    @ApiProperty({
        name:'templateId',
        description:"templateId of the presentation templete to form presentation request",
        example:"6392854982......"
    })
    @IsString()
    @Trim()
    @IsNotEmpty()
    templateId:string


    @ApiProperty({
        name:'expiresTime',
        description:"expiresTime  for the presentation request (unix timestamp)",
        example:1231423
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(Number(new Date()))
    expiresTime:number


    @ApiProperty({
        name:'callbackUrl',
        description:"callbackUrl that will receive verifiable presentation",
        example:'https://example.com/verify/callback'
    })
    @IsUrl()
    @Trim()
    @IsNotEmpty()
    callbackUrl:string






}





export class CreatePresentationResponseDto{

}


export  class CreatePresentationDto{

    @ApiProperty({
        name:"credentials",
        description:"list of credentials"
        ,example:[
            CredDoc
        ]
    })
    @ValidateNested()
    @Type(()=>CredDoc)
    credentials:Array<CredDoc>


    @ApiProperty({
        name:"holderDid",
        description:"list of credentials"
        ,example:'did:hid:testnet:............'
    })
    @IsString()
    @IsDid()
    holderDid:string

    @ApiProperty({
        name:'challenge',
        description:"Challenge can be used to match the response to a request ",
        example:"skfdhldklgjh-gaghkdhgaskda-aisgkjheyi"
    })

    @IsString()
    @Trim()
    @IsNotEmpty()
    challenge:string
    @ApiProperty({
        name:'domain',
        description:"domain that will receive verifiable presentation",
        example:'example.com'
    })
    @Trim()
    @IsNotEmpty()
    domain:string
}



export class verifiPresntationDto{
    @ApiProperty({
        name:"presentation",
        description:"list of credentials"
        ,example:{

        }
    })
    @IsObject()
    presentation:object
}