import {
  Controller,
  Get,
  ValidationPipe,
  Post,
  UsePipes,
  Body,
  Put,
  Param,
  UseInterceptors,
  HttpCode,
  UseFilters,
  Query,
  UseGuards,
  Req,
  Delete,
  Logger,
  Res,
} from '@nestjs/common';
import { CreateAppDto } from 'src/app-auth/dtos/create-app.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppNotFoundException } from 'src/app-auth/exceptions/app-not-found.exception';
import { MongooseClassSerializerInterceptor } from '../../utils/utils';
import { AllExceptionsFilter } from '../../utils/utils';
import { PaginationDto } from 'src/utils/pagination.dto';
import { AuthenticatedGuard } from 'src/org-user/guard/authenticated.guard';
import { UserService } from '../services/user.service';

@UseFilters(AllExceptionsFilter)
@ApiTags('Super Admin')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/hs/api/v2/auth')
  @UsePipes(new ValidationPipe({ transform: true }))
  authenticate(@Res() res: any, @Req() req: any, @Body() body: any) {
    Logger.log('authenticate() method: starts', 'userController');

    const { hypersign } = body;
    Logger.log(hypersign);
    const { user } = hypersign.data;
    Logger.log(user);
    res.status(200).json({
      status: 200,
      message: user,
      error: null,
    });
  }

  @Post('/api/v2/protected')
  @UsePipes(new ValidationPipe({ transform: true }))
  authorize(@Res() res: any, @Req() req: any, @Body() body: any) {
    Logger.log('authorize() method: starts', 'userController');
    const { hypersign } = body;
    res.status(200).json({
      status: 200,
      message: hypersign.data,
      error: null,
    });
  }
}
