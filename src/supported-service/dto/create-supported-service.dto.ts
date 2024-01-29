import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export enum services {
  CAVACH_API = 'CAVACH_API',
  SSI_API = 'SSI_API',
}
export class supportedServiceResponseDto {
  @ApiProperty({
    description: 'id',
    example: 'SSI_API',
  })
  id: string;
  @ApiProperty({
    description: 'dBSuffix',
    example: 'cavachDB',
  })
  dBSuffix: string;
  @ApiProperty({
    description: 'name',
    example: 'cavach',
  })
  @IsEnum(services, {
    each: true,
    message:
      "services must be one of the following values: 'CAVACH_API', 'SSI_API'",
  })
  name: string;
  @ApiProperty({
    description: 'domain',
    example: 'api.cavach.hypersign.id',
  })
  domain: string;

  @ApiProperty({
    description: 'description',
    example: 'A generic service interface for kyc verification',
  })
  description: string;
  @ApiProperty({
    description: 'swaggerAPIDocPath',
    example: '/ssi',
  })
  swaggerAPIDocPath: string;
}
