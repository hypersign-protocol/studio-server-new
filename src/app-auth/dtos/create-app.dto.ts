import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({
    description: 'User DID',
    example: 'did:hid:testnet:123123',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @IsNotEmpty()
  appName: string;
}

export class CreateAppResponseDto {
  @ApiProperty({
    description: 'App ID',
    example: 'demoappid-1',
  })
  @IsNotEmpty()
  appId: string;

  @ApiProperty({
    description: 'Application Name',
    example: 'demo app',
  })
  @IsNotEmpty()
  appName: string;
  @ApiProperty({
    description: 'Application Secret',
    example: 'lgaljghlkajg',
  })
  @IsOptional()
  appSecret?: string;

  @ApiProperty({
    description: 'Application Wallet Address',
    example: 'hid123...........',
  })
  @IsNotEmpty()
  walletAddress: string;
}
