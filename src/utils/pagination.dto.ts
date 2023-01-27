import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty()
  page: number;
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty()
  limit: number;
}
