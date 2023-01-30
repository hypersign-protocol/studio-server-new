import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';

export class CreatePresentationTemplateDto {
  @ApiProperty({
    name: 'domain',
    description: 'Domain name',
    example: 'fyre.hypersign.id',
  })
  // add chek for valid domain
  @IsString()
  @Trim()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    name: 'name',
    description: 'name of the presentation template',
    example: 'RailTicket template',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    name: 'reason',
    description: 'reason for creating a tempate',
    example: 'For verifying  railway ticket',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  reason: string;
  @ApiProperty({
    name: 'queryType',
    description: '',
    example: 'QueryByExample',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  queryType: string;
  @ApiProperty({
    name: 'issuerDid',
    description:
      'did of the issuer of credential for which presentation is to be created',
    example: 'did:hid:testnet:..................',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  issuerDid: string;
  @ApiProperty({
    name: 'schemaId',
    description: 'id of schema for which presentaion has created',
    example: 'sch:hid:testnet:..................',
  })
  @IsString()
  @Trim()
  @IsNotEmpty()
  schemaId: string;
}
