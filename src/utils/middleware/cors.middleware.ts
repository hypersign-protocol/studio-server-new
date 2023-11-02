import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { AppRepository } from 'src/app-auth/repositories/app.repository';
@Injectable()
export class WhitelistSSICorsMiddleware implements NestMiddleware {
  constructor(private readonly appRepositiory: AppRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      'WhitelistSSICorsMiddleware: checking if call is form whitelisted domain starts',
      'Middleware',
    );
    const origin = req.header('Origin') || req.header('Referer');

    Logger.debug(
      `WhitelistSSICorsMiddleware: request is comming from ${origin}`,
      'Middleware',
    );

    const subdomain = req.headers['x-subdomain'];
    Logger.debug(`Subdomain ${subdomain} `, 'Middleware');

    if (!subdomain) {
      throw new BadRequestException(['Invalid subdomain']);
    }

    let matchOrigin;
    if (origin) {
      // regex to check if url consists of some path or not
      const originRegx = /^https?:\/\/[^\/]+/i;
      matchOrigin = origin.match(originRegx);
    }
    if (
      req.header('authorization') == undefined ||
      req.header('authorization') == ''
    ) {
      Logger.error(
        'WhitelistSSICorsMiddleware: Error authorization token is null or undefiend',
        'Middleware',
      );

      throw new UnauthorizedException([
        'Unauthorized',
        'Please pass access token',
      ]);
    } else if (req.header('authorization')) {
      const token = req.header('authorization').split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        Logger.error(`WhitelistSSICorsMiddleware: Error ${e}`, 'Middleware');

        throw new UnauthorizedException([e]);
      }
      const whitelistedOrigins = process.env.WHITELISTED_CORS;
      if (matchOrigin && whitelistedOrigins.includes(matchOrigin[0])) {
        return next();
      }
      const appInfo = await this.appRepositiory.findOne({
        appId: decoded['appId'],
        userId: decoded['userId'],
        subdomain,
      });

      if (!appInfo) {
        throw new UnauthorizedException(['Invalid authorization token']);
      }

      if (appInfo.whitelistedCors.includes('*')) {
        Logger.log(
          'WhitelistSSICorsMiddleware: Origin includes *. Allowing all',
          'Middleware',
        );

        req.user = {};
        req.user['subdomain'] = subdomain;
        return next();
      }
      if (!appInfo['whitelistedCors'].includes(origin)) {
        throw new UnauthorizedException(['Origin mismatch']);
      }
    } else {
      throw new UnauthorizedException(['This is a cors enabled api']);
    }
    next();
  }
}
