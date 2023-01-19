import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty({
    description: 'appId',
    example: '03b27d82-8d6d-4ce2-927a-498726e20928',
  })
  @IsNotEmpty()
  @IsString()
  appId: string;
  @ApiProperty({
    description: 'appSecret',
    example: 'f143a15f-892d-4982-8fcf-2f8b09cfb633',
  })
  @IsNotEmpty()
  @IsString()
  appSecret: string;

  @ApiProperty({
    description: 'grantType',
    example: 'client_credentials',
  })
  @IsNotEmpty()
  @IsString()
  grantType: string;
}
