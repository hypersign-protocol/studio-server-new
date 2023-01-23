import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/customDecorator/trim.decorator';
export class CreateDidDto {
  @ApiProperty({
    description: 'Method to be added in did.',
    example: 'testnet',
  })
  @Trim()
  method: string;
}
