import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class JWTAuthorizeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    Logger.log('Inside JWTAuthorizeMiddleware', 'HypersignAuthorizeMiddleware');
    if (!req.header('authorization') || req.headers['authorization'] === '') {
      throw new UnauthorizedException([
        'Please pass authorization token in the header',
      ]);
    }
    const authToken = req.header('authorization');
    const tokenParts: Array<string> = authToken.split(' ');
    if (tokenParts[0] !== 'Bearer') {
      Logger.log('Bearer authToken is not passed in header');
      throw new UnauthorizedException(['Please pass Bearer auth token']);
    }
    let decoded;
    try {
      decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    } catch (e) {
      Logger.error(`JWTAuthorizeMiddleware: Error ${e}`, 'Middleware');

      throw new UnauthorizedException([e]);
    }
    req['body']['hypersign'] = {};
    req['body']['hypersign'].data = {};
    req['body']['hypersign'].data = { ...decoded };
    next();
  }
}
