import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Trim } from 'src/utils/customDecorator/trim.decorator';
export class CreateDidDto {
  @ApiProperty({
    description: 'Method to be added in did.',
    example: 'testnet',
  })
  @IsString()
  @Trim()
  method: string;
}
