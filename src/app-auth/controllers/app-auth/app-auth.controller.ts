import { Controller, Get, ValidationPipe, Post, UsePipes, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { CreateAppDto } from 'src/app-auth/dtos/CreateApp.dto';
import { AppAuthService } from 'src/app-auth/services/app-auth/app-auth.service';
import { Request, Response } from 'express'
@Controller('app-auth')
export class AppAuthController {
    constructor(private readonly appAuthService: AppAuthService){}

    @Get()
    getAppAuth() {
        return this.appAuthService.getAllApps();
    }

    @Post('/register')
    @UsePipes(ValidationPipe)
    register(@Body() createAppDto: CreateAppDto) {
        return this.appAuthService.createAnApp(createAppDto)
    }

}
