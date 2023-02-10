import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { App } from '../schemas/app.schema';

export class AppError {
  @ApiProperty({
    description: 'statusCode',
    example: 400,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'message',
    example: ['error message 1', 'error message 2'],
  })
  @IsString()
  message: Array<string>;

  @ApiProperty({
    description: 'error',
    example: 'Bad Request',
  })
  @IsString()
  error: string;
}

export class GetAppList {
  @ApiProperty({
    description: 'totalCount',
    example: 12,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'data',
    type: App,
    isArray: true,
  })
  @IsString()
  @IsArray()
  data: Array<App>;
}
