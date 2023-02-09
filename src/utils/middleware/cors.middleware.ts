import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { AppRepository } from 'src/app-auth/repositories/app.repository';
@Injectable()
export class WhitelistMiddleware implements NestMiddleware {
  constructor(private readonly appRepositiory: AppRepository) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.header('Origin');
    if (req.header('authorization') == 'undefined') {
      throw new UnauthorizedException(['Unauthorized']);
    } else if (req.header('authorization')) {
      const token = req.header('authorization').split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        throw new UnauthorizedException([e]);
      }
      const appInfo = await this.appRepositiory.findOne({
        appId: decoded['appId'],
        userId: decoded['userId'],
      });
      
      if(appInfo.whitelistedCors.includes("*")){
       return next()

      }
         if (!appInfo['whitelistedCors'].includes(origin)) {
        throw new UnauthorizedException(['Origin mismatch']);
      }
    } else {
      throw new UnauthorizedException(['This is a cors enable api']);
    }
    next();
  }
}
