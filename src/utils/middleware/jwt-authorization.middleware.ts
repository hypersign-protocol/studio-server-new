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
    Logger.log('Inside JWTAuthorizeMiddleware', 'JWTAuthorizeMiddleware');
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
      if (decoded) {
        req['user'] = {
          userId: decoded.appUserID,
          email: decoded.email,
          name: decoded.name,
          id: decoded['id'],
        };

        Logger.log(JSON.stringify(req.user), 'JWTAuthorizeMiddleware');
      }
    } catch (e) {
      Logger.error(
        `JWTAuthorizeMiddleware: Error ${e}`,
        'JWTAuthorizeMiddleware',
      );
      throw new UnauthorizedException([e]);
    }
    next();
  }
}
