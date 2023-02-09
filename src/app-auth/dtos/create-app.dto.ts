import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/utils/customDecorator/trim.decorator';

export class CreateAppDto {
  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @Trim()
  @IsNotEmpty()
  appName: string;

  @ApiProperty({
    description: 'Whitelisted cors',
    example: ['https://example.com'],
    isArray: true,
  })

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Matches(/^(https?:\/\/[^ ]+|\*)$/, { each: true })
  whitelistedCors: Array<string>;
  @ApiProperty({
    description: 'description',
    example: 'Example description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'logoUrl',
    example: 'http://image.png',
    required: false,
  })
  logoUrl: string;
}
