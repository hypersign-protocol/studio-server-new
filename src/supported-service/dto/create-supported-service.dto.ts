import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
// export enum services {
//     cavach = 'cavach',
//     entityApi = 'entityApi',
// }
export class supportedServiceResponseDto {
  @ApiProperty({
    description: 'dBSuffix',
    example: 'cavachDB',
  })
  dBSuffix: string;
  @ApiProperty({
    description: 'name',
    example: 'cavach',
  })
  // @IsEnum(services, {
  //     message: "services must be one of the following values: 'cavach', 'entityApi'",
  // })
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
}
