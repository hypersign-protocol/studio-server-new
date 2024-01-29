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
import { AllExceptionsFilter, sanitizeUrl } from 'src/utils/utils';
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
  socialAuthRedirect(@Res() res) {
    Logger.log('socialAuthRedirect() method starts', 'SocialLoginController');
    const authUrl = `${
      this.config.get('GOOGLE_AUTH_BASE_URL') ||
      'https://accounts.google.com/o/oauth2/v2/auth'
    }?response_type=code&redirect_uri=${
      this.config.get('GOOGLE_CALLBACK_URL') ||
      sanitizeUrl(this.config.get('DEVELOPER_DASHBOARD_SERVICE_PUBLIC_EP')) +
        '/api/v1/login/callback'
    }&scope=email%20profile&client_id=${this.config.get('GOOGLE_CLIENT_ID')}`;
    res.json({ authUrl });
  }

  @Get('/api/v1/login/callback')
  @UseGuards(AuthGuard('google'))
  async socialAuthCallback(@Req() req, @Res() res) {
    Logger.log('socialAuthCallback() method starts', 'SocialLoginController');
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
