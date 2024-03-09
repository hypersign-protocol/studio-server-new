import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrlEmpty } from 'src/utils/customDecorator/isUrl.decorator';
import { Transform } from 'class-transformer';
import validator from 'validator';
import { SanitizeUrlValidator } from 'src/utils/sanitizeUrl.validator';
import { SERVICE_TYPES } from 'src/supported-service/services/service-list';

export class CreateAppDto {
  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @Transform(({ value }) => validator.trim(value))
  @Length(5, 50)
  appName: string;

  @ApiProperty({
    description: 'Whitelisted cors',
    example: ['https://example.com'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Matches(/^(https?:\/\/[^ ]+|\*)$/, {
    each: true,
    message: 'Whitelisted cors must be a valid url or *',
  })
  @Validate(SanitizeUrlValidator)
  whitelistedCors: Array<string>;
  @ApiProperty({
    description: 'description',
    example: 'Example description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description: string;
  @ApiProperty({
    description: 'logoUrl',
    example: 'http://image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrlEmpty()
  logoUrl: string;
  @ApiProperty({
    description: 'services',
    example: [SERVICE_TYPES.SSI_API],
    required: true,
    isArray: true,
  })
  @IsArray({ message: 'serviceId must be an array' })
  @ArrayNotEmpty({ message: 'serviceIds cannot be empty' })
  @IsString({
    each: true,
    message: 'Each value in serviceIds must be a string',
  })
  @IsEnum(SERVICE_TYPES, {
    each: true,
    message:
      "services must be one of the following values: 'CAVACH_API', 'SSI_API'",
  })
  serviceIds: [SERVICE_TYPES];
}
