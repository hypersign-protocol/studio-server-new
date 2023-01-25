import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCredentialDto } from './create-credential.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDid } from 'src/schema/decorator/schema.decorator';
import { ValidateVerificationMethodId } from 'src/utils/customDecorator/vmId.decorator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';


export enum status{
    LIVE='LIVE',
    SUSPEND='SUSPEND',
    REVOKE='REVOKE'
} 

export class UpdateCredentialDto {
    @ApiProperty({
        name: 'namespace',
        description: 'Namespace to be added in did.',
        example: 'testnet',
      })
      @IsString()
      @Trim()
      namespace: string;
    @ApiProperty({
        name:'status',
        description:'Credential status',
        example:'LIVE / SUSPEND / REVOKE'
    })
    @IsEnum(status)
    status:status
    @ApiProperty({
        name:'statusReason',
        description:'Credential status Reason',
        example:'Reason'
    })
    @IsOptional()
    statusReason:string
    @ApiProperty({
        name: 'issuerDid',
        description: 'issuerDid of the credential',
    })
    @IsString()
    @IsDid()
    issuerDid: string

    @ApiProperty({
        description: 'Verification Method id for did updation',
        example: 'did:hid:testnet:........#key-${idx}',
      })
      @ValidateVerificationMethodId()
      @IsString()
      verificationMethodId: string;


    

    
}
