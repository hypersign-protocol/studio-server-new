import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
export class PaginationDto {
  @Type(() => Number)
  @Transform(({ value }) => (value ? value : value == 1))
  @IsInt()
  @Min(1)
  @Max(100)
  @Optional()
  @ApiProperty({
    name: 'page',
    default: 1,
  })
  page?: number = 1;
  @Type(() => Number)
  @Transform(({ value }) => (value ? value : value == 10))
  @IsInt()
  @Min(1)
  @Max(100)
  @Optional()
  @ApiProperty({
    name: 'limit',
    default: 10,
  })
  limit?: number = 10;
}
