import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UnauthorizedError {
  @ApiProperty({
    description: 'statusCode',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'message',
    example: ['error message 1'],
  })
  @IsString()
  message: Array<string>;

  @ApiProperty({
    description: 'error',
    example: 'Unauthorized Request',
  })
  @IsString()
  error: string;
}

export class LoginResponse {
  @ApiProperty({
    description: 'authUrl',
    example: 'https://accounts.google.com/.........',
  })
  authUrl: string;
}

export class Message {
  @ApiProperty({
    description: 'userId',
    example: 'ccc234_hrk959y_uwo',
  })
  userId: string;
  @ApiProperty({
    description: 'email',
    example: 'xyz@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'name',
    example: 'varsha',
  })
  name: string;
}
export class AuthResponse {
  @ApiProperty({
    description: 'status',
    example: '200',
  })
  status: number;
  @ApiProperty({
    description: 'message',
    type: Message,
  })
  message: Message;
  @ApiProperty({
    description: 'error',
    example: null,
  })
  error: string;
}
