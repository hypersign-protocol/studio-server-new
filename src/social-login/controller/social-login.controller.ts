import {
  Controller,
  Get,
  UseGuards,
  Req,
  Logger,
  UseFilters,
  Post,
} from '@nestjs/common';
import { SocialLoginService } from '../services/social-login.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
// import { DynamicAuthGuard } from '../strategy/dynamic-auth-gaurd';
@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class SocialLoginController {
  constructor(private readonly socialLoginService: SocialLoginService) {}
  @Get('/api/v1/login')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    Logger.log('googleAuthRedirect() method starts', 'SocialLoginController');
    return this.socialLoginService.googleLogin(req);
  }
  @Post('/api/v1/auth') // add gaurd here later
  dispatchUserDetail(@Req() req) {
    Logger.log('dispatchUserDetail() method starts', 'SocialLoginController');
    return { status: 200, message: req.user, error: null };
  }
}
