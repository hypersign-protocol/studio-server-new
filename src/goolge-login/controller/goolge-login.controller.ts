import { Controller, Get, UseGuards, Req, Logger, UseFilters } from '@nestjs/common';
import { GoolgeLoginService } from '../services/goolge-login.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/utils/utils';
@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class GoolgeLoginController {
  constructor(private readonly goolgeLoginService: GoolgeLoginService) { }
  @Get('api/v1/login')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    Logger.log('Google login starts', 'GoolgeLoginController');
    return this.goolgeLoginService.googleLogin(req);
  }
}
