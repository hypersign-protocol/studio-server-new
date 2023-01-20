import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDidDto {
  @ApiProperty({
    description: 'Method to be added in did',
    example: 'hid',
  })
  @IsOptional()
  method: string;
}
