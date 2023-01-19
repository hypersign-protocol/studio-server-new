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
import { CreateAppDto } from 'src/app-auth/dtos/create-app.dto';
import {
  GenerateTokenDto,
  GenerateTokenErrorDto,
  GenerateTokenResponseDto,
} from '../dtos/generate-token.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth.service';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { App } from '../schemas/app.schema';
import { AppNotFoundException } from 'src/app-auth/exceptions/app-not-found.exception';
import { UpdateAppDto } from '../dtos/update-app.dto';
import { MongooseClassSerializerInterceptor } from '../../utils';




@ApiTags('App')
@Controller('app')
export class AppAuthController {
  constructor(private readonly appAuthService: AppAuthService) {}
  @UseInterceptors(MongooseClassSerializerInterceptor(App,{}))
  @Get(':userId')

  @ApiResponse({
    description: 'List of apps',
    type: [App],
  })
  getApps(@Param('userId') userId: string): Promise<App[]> {
    const appList = this.appAuthService.getAllApps(userId);
    if (appList) return appList;
  }
  @UseInterceptors(MongooseClassSerializerInterceptor(App,{excludePrefixes:['appSecret',"_","__"]}))
  @Get(':appId')
  @ApiResponse({
    description: 'Fetch App by Id',
    type: App,
  })
  @ApiBadRequestResponse({
    description: 'Application not found',
  })
  async getAppById(@Param('appId') appId: string): Promise<App> {
    const app = await this.appAuthService.getAppById(appId);
    if (app) return app;
    else throw new AppNotFoundException(); // Custom Exception handling
  }
  @Post()
  @UseInterceptors(MongooseClassSerializerInterceptor(App,{excludePrefixes:["_","__"]}))
  @ApiCreatedResponse({
    description: 'Newly created app',
    type: App,
  })
  @ApiBadRequestResponse({
    description: 'Application could not be registered',
  })
  @UsePipes(ValidationPipe)
  register(@Body() createAppDto: CreateAppDto): Promise<App> {
    return this.appAuthService.createAnApp(createAppDto);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(App,{excludePrefixes:["appSecret","_","__"]}))
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
    @Param('appId') appId: string,
    @Body() updateAppDto: UpdateAppDto,
  ): Promise<App> {
    const app = await this.appAuthService.getAppById(appId);
    if (app) {
      return this.appAuthService.updateAnApp(appId, updateAppDto);
    } else throw new AppNotFoundException();
  }

  @Post('auth')
  @HttpCode(200)
  @ApiResponse({
    description: 'Generate access token',
    type:GenerateTokenResponseDto
     
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' ,type:GenerateTokenErrorDto })
  @UsePipes(ValidationPipe)
  generateAccessToken(
    @Body() generateAccessToken: GenerateTokenDto,
  ): Promise<{ access_token; expiresIn; tokenType }> {
    return this.appAuthService.generateAccessToken(generateAccessToken);
  }
}
