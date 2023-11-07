import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenError {
  @ApiProperty({
    description: 'statusCode',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'message',
    example: ['access_denied'],
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Unauthorized',
    example: 'Unauthorized',
  })
  @IsString()
  error: 'Unauthorized';
}
export class GenerateTokenResponse {
  @ApiProperty({
    description: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjRkNjhmMjNmLTcwZjQtNDFhZC1hMGViLTU3MjA4YTZlOTcxMSIsImFwcFNlY3JldCI6IjNjN2NiNTY1LTZmNWQtNGY2MC1hMjQ2LTZhOGFjYWVhMmY0MyIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImlhdCI6MTY3NDAyMDY3NCwiZXhwIjoxNjc0MDM1MDc0fQ.P-AbheTJMxQNGLTkGWOsnct4M0nKCd-7oUFGqMCpIDM',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Type of token',
    example: 'Bearer',
  })
  @IsNotEmpty()
  @IsString()
  tokenType: string;

  @ApiProperty({
    description: 'Token expiry time',
    example: 14400,
  })
  @IsNotEmpty()
  @IsNumber()
  expiresIn: number;
}

export class RegenrateAppApiSecretResponse {
  @ApiProperty({
    description: 'apiSecretKey for getting access token',
    example: 'xyz.ert34nbhjf48959',
  })
  apiSecretKey: string;
}

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
