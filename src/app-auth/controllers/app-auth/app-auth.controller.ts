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
    register(@Req() req: Request,@Res() res: Response): any {

        console.log(req.body)
        const b  = new CreateAppDto()
        b.userId = req.body['userId'];
        b.appName = req.body['appName'];
        const napp = this.appAuthService.createAnApp(b)
        return res.status(HttpStatus.CREATED).send(napp)
    }

}
