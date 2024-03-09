import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SERVICE_TYPES } from '../services/service-list';

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
  @IsEnum(SERVICE_TYPES, {
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
