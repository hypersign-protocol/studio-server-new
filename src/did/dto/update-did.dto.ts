import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateDidDto {
  @ApiProperty({
    description: 'Did doc to be updated',
    example: {},
  })
  @IsObject()
  didDoc: object;

  @ApiProperty({
    description: 'Field to check if to deactivate did or to update it ',
    example: false,
  })
  isToDeactivateDid: boolean;
}
