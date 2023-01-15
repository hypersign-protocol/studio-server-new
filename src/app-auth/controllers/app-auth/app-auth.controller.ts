import { Controller, Get, ValidationPipe, Post, UsePipes, Body, Req, Res, HttpStatus, Param} from '@nestjs/common';
import { CreateAppDto } from 'src/app-auth/dtos/CreateApp.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth/app-auth.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApp } from '../../types/App.types';
import { AppSchema } from '../../schemas/App.schema';  
import { AppNotFoundException  } from 'src/app-auth/exceptions/AppNotFound.exception';

@ApiTags('App')
@Controller('app')
export class AppAuthController {
    constructor(private readonly appAuthService: AppAuthService){}

    @Get()
    @ApiResponse({
        description: 'List of apps',
        type: [AppSchema]
    })
    getApps() {
        return this.appAuthService.getAllApps();
    }

    @Get(':appId')
    @ApiResponse({
        description: 'Fetch App by Id',
        type: AppSchema
    })
    @ApiBadRequestResponse({
        description: "Application not found"
    })
    getAppById(@Param('appId') appId: string): IApp {
        const app = this.appAuthService.getAppById(appId);
        if(app) return app;
        else throw new AppNotFoundException(); // Custom Exception handling
    }

    @Post('/register')
    @ApiCreatedResponse({
        description: 'Newly created app',
        type: AppSchema
    })
    @ApiBadRequestResponse({
        description: "Application could not be registered"
    })
    @UsePipes(ValidationPipe)
    register(@Body() createAppDto: CreateAppDto): IApp{
        return this.appAuthService.createAnApp(createAppDto)
    }

}
