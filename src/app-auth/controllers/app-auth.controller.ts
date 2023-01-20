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
} from '@nestjs/common';
import { User } from '../decorator/user.decorator';
import { CreateAppDto } from 'src/app-auth/dtos/create-app.dto';
import {
  GenerateTokenDto,
  GenerateTokenError,
  GenerateTokenResponse,
} from '../dtos/generate-token.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { App, createAppResponse } from '../schemas/app.schema';
import { AppNotFoundException } from 'src/app-auth/exceptions/app-not-found.exception';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { MongooseClassSerializerInterceptor } from '../../utils';

@ApiTags('App')
@Controller('app')
export class AppAuthController {
  constructor(private readonly appAuthService: AppAuthService) {}
  @UseInterceptors(
    MongooseClassSerializerInterceptor(App, {
      excludePrefixes: ['appSecret', '_', '__'],
    }),
  )
  @Get()
  @ApiResponse({
    description: 'List of apps',
    type: [App],
  })
  getApps(@User() userId): Promise<App[]> {
    const appList = this.appAuthService.getAllApps(userId);
    if (appList) return appList;
  }
  @UseInterceptors(
    MongooseClassSerializerInterceptor(App, {
      excludePrefixes: ['appSecret', '_', '__'],
    }),
  )
  @Get(':appId')
  @ApiResponse({
    description: 'Fetch App by Id',
    type: App,
  })
  @ApiBadRequestResponse({
    description: 'Application not found',
  })
  async getAppById(
    @User() userId,
    @Param('appId') appId: string,
  ): Promise<App> {
    const app = await this.appAuthService.getAppById(appId, userId);
    if (app) return app;
    else throw new AppNotFoundException(); // Custom Exception handling
  }
  @Post()
  @UseInterceptors(
    MongooseClassSerializerInterceptor(createAppResponse, {
      excludePrefixes: ['_', '__'],
    }),
  )
  @ApiCreatedResponse({
    description: 'Newly created app',
    type: createAppResponse,
  })
  @ApiBadRequestResponse({
    description: 'Application could not be registered',
  })
  @UsePipes(ValidationPipe)
  register(
    @User() userId,
    @Body() createAppDto: CreateAppDto,
  ): Promise<createAppResponse> {
    return this.appAuthService.createAnApp(createAppDto, userId);
  }

  @UseInterceptors(
    MongooseClassSerializerInterceptor(App, {
      excludePrefixes: ['appSecret', '_', '__'],
    }),
  )
  @Put(':appId')
  @ApiResponse({
    description: 'Updated app',
    type: App,
  })
  @ApiBadRequestResponse({
    description: 'Application not found',
  })
  @UsePipes(ValidationPipe)
  async update(
    @User() userId,
    @Param('appId') appId: string,
    @Body() updateAppDto: UpdateAppDto,
  ): Promise<App> {
    const app = await this.appAuthService.getAppById(appId, userId);
    if (app) {
      return this.appAuthService.updateAnApp(appId, updateAppDto, userId);
    } else throw new AppNotFoundException();
  }

  @Post('oauth')
  @HttpCode(200)
  @ApiResponse({
    description: 'Generate access token',
    type: GenerateTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: GenerateTokenError,
  })
  @UsePipes(ValidationPipe)
  generateAccessToken(
    @User() userId,
    @Body() generateAccessToken: GenerateTokenDto,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    return this.appAuthService.generateAccessToken(generateAccessToken, userId);
  }
}
