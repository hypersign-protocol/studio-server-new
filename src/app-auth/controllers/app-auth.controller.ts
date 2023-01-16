import {
  Controller,
  Get,
  ValidationPipe,
  Post,
  UsePipes,
  Body,
  Put,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CreateAppDto } from 'src/app-auth/dtos/create-app.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { App } from '../schemas/app.schema';
import { AppNotFoundException } from 'src/app-auth/exceptions/app-not-found.exception';
import { UpdateAppDto } from '../dtos/update-app.dto';
@ApiTags('App')
@Controller('app')
export class AppAuthController {
  constructor(private readonly appAuthService: AppAuthService) {}

  @Get()
  @ApiResponse({
    description: 'List of apps',
    type: [App],
  })
  getApps(): Promise<App[]> {
    return this.appAuthService.getAllApps();
  }

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

  @Put(':appId')
  @ApiCreatedResponse({
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
}
