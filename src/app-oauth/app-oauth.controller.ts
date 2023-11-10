import {
  Controller,
  ValidationPipe,
  Post,
  UsePipes,
  HttpCode,
  UseFilters,
  Headers,
  Logger,
} from '@nestjs/common';

import { AppAuthService } from 'src/app-auth/services/app-auth.service';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
import {
  AppSecretHeader,
  AppSubdomainHeader,
} from './dtos/app-sercret.decorator';
import {
  GenerateTokenError,
  GenerateTokenResponse,
  AppError,
} from './dtos/generate-token.dto';

@UseFilters(AllExceptionsFilter)
@ApiTags('Super Admin')
@Controller('app')
export class AppOauthController {
  constructor(private readonly appAuthService: AppAuthService) {}

  @ApiHeader({
    name: 'X-Api-Secret-Key',
    description: 'Provide Api Secret  key to get access token',
    required: true,
  })
  @ApiHeader({
    name: 'Origin',
    description: 'Origin as you set in application cors',
    required: false,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Error occured at the time of generating access token',
    type: AppError,
  })
  @Post('oauth')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'AccessToken generated',
    type: GenerateTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: GenerateTokenError,
  })
  @UsePipes(ValidationPipe)
  generateAccessToken(
    @Headers('X-Api-Secret-Key') apiSectretKey: string,
    @AppSecretHeader() appSecreatKey,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    Logger.log('reGenerateAppSecretKey() method: starts', 'AppOAuthController');
    return this.appAuthService.generateAccessToken(appSecreatKey);
  }
}
