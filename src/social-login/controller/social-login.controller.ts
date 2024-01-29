import {
  Controller,
  Get,
  UseGuards,
  Req,
  Logger,
  UseFilters,
  Post,
  Res,
  Query,
} from '@nestjs/common';
import { SocialLoginService } from '../services/social-login.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
import { ConfigService } from '@nestjs/config';
import {
  AuthResponse,
  LoginResponse,
  UnauthorizedError,
} from '../dto/response.dto';
@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class SocialLoginController {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly config: ConfigService,
  ) {}
  @ApiResponse({
    status: 200,
    description: 'Auth url',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    type: UnauthorizedError,
  })
  @ApiQuery({
    name: 'provider',
    description: 'Authentication provider',
    required: true,
  })
  @Get('/api/v1/login')
  async socialAuthRedirect(@Res() res, @Query() loginProvider) {
    Logger.log('socialAuthRedirect() method starts', 'SocialLoginController');
    const { provider } = loginProvider;
    Logger.log(`Looged in with ${provider}`, 'SocialLoginController');
    const { authUrl } = await this.socialLoginService.generateAuthUrlByProvider(
      provider,
    );
    res.json({ authUrl });
  }
  @ApiExcludeEndpoint()
  @Get('/api/v1/login/callback')
  @UseGuards(AuthGuard('google'))
  async socialAuthCallback(@Req() req, @Res() res) {
    Logger.log('socialAuthCallback() method starts', 'SocialLoginController');
    const token = await this.socialLoginService.socialLogin(req);
    res.redirect(`${this.config.get('REDIRECT_URL')}?token=${token}`);
  }
  @ApiOkResponse({
    description: 'User Info',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    type: UnauthorizedError,
  })
  @Post('/api/v1/auth')
  dispatchUserDetail(@Req() req) {
    Logger.log('dispatchUserDetail() method starts', 'SocialLoginController');
    return {
      status: 200,
      message: req.user,
      error: null,
    };
  }
}
