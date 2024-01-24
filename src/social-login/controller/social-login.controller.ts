import {
  Controller,
  Get,
  UseGuards,
  Req,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { SocialLoginService } from '../services/social-login.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class SocialLoginController {
  constructor(private readonly socialLoginService: SocialLoginService) {}
  @Get('api/v1/login')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    Logger.log('Social login starts', 'SocialLoginController');
    return this.socialLoginService.googleLogin(req);
  }
}
