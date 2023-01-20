import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignDidDto {
  @ApiProperty({
    description: 'Method to be added in did',
    example: 'hid',
  })
  @IsOptional()
  verificationMethodId?: string; // verification method id

  @ApiProperty({
    description: 'DId document to signed',
    example: 'hid',
  })
  didDocument: object; // A DID Document to signed

  @ApiProperty({
    description: 'Random challenge',
    example: 'xyz-1234',
  })
  @IsString()
  @IsNotEmpty()
  challenge: string; // Random challenge

  @ApiProperty({
    description: 'Domain name',
    example: 'studio.in',
  })
  @IsString()
  @IsNotEmpty()
  domain: string; // Domain name

  @ApiProperty({
    description: 'did',
    example: 'did:hid:23jhey84itoh',
  })
  // @IsOptional()
  @IsString()
  @IsNotEmpty()
  did?: string; // DID, if passed then DID will be resolved and `didDocument` parameter will not be used
}
