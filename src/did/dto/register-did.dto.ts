import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { DidDoc, UpdateDidDto } from "./update-did.dto";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ValidateVerificationMethodId } from "src/utils/customDecorator/vmId.decorator";
import { type } from "os";

export enum IClientSpec {
    'eth-personalSign' = 'eth-personalSign',
    'cosmos-ADR036' = 'cosmos-ADR036',
}
export class RegisterDidDto {
    @ApiProperty({
        description: 'Did doc to be updated',
        type: DidDoc,
    })
    @Type(() => DidDoc)
    @ValidateNested({each:true})
    didDocument: DidDoc;

    @ApiProperty({
        description: 'Verification Method id for did updation',
        example: 'did:hid:testnet:........#key-${idx}',
        required:true
    })    
    @ValidateVerificationMethodId()
    @IsString()
    verificationMethodId: string;


    @ApiProperty({
        description:
            "IClientSpec  'eth-personalSign' or      'cosmos-ADR036'",
        example: 'eth-personalSign',
        name: 'clientSpec',
    })
    @IsOptional()
    @IsEnum(IClientSpec)
    clientSpec: IClientSpec;


    @ApiProperty({
        description:
            "Signature for clientSpec",
        example: 'afafljagahgp9agjagknaglkj/kagka=',
        name: 'signature',
    })
    @IsOptional()
    @IsString()
    signature: string;
    @ApiProperty({
        description:
            "Signature for clientSpec cosmos-ADR036",
        example: "hid148273582",
        name: 'address',
    })
    @IsOptional()
    @IsString()
    address: string


}


