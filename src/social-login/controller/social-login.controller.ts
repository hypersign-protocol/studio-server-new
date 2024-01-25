import {
  Controller,
  Get,
  UseGuards,
  Req,
  Logger,
  UseFilters,
  Post,
  Res,
} from '@nestjs/common';
import { SocialLoginService } from '../services/social-login.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
import { ConfigService } from '@nestjs/config';
@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class SocialLoginController {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly config: ConfigService,
  ) {}
  @Get('/api/v1/login')
  @UseGuards(AuthGuard('google'))
  socialAuth() {
    Logger.log('socialAuth() method starts', 'SocialLoginController');
  }

  @Get('/api/v1/login/callback')
  @UseGuards(AuthGuard('google'))
  async socialAuthRedirect(@Req() req, @Res() res) {
    Logger.log('socialAuthRedirect() method starts', 'SocialLoginController');
    const token = await this.socialLoginService.socialLogin(req);
    res.redirect(`${this.config.get('REDIRECT_URL')}?token=${token}`);
  }
  @Post('/api/v1/auth') // add gaurd here later
  dispatchUserDetail(@Req() req) {
    Logger.log('dispatchUserDetail() method starts', 'SocialLoginController');
    return {
      status: 200,
      message: req.user,
      error: null,
    };
  }
}
