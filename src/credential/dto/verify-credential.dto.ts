import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CredDoc } from './create-credential.dto';

export class VerifyCredentialDto {
  @ApiProperty({
    name: 'credential',
    description: 'credential document',
  })
  @ValidateNested()
  @Type(() => CredDoc)
  credential: CredDoc;
}
