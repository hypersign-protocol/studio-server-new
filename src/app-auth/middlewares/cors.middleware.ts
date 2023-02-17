import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { AppRepository } from 'src/app-auth/repositories/app.repository';
@Injectable()
export class WhitelistCorsMiddleware implements NestMiddleware {
  constructor(private readonly appRepositiory: AppRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const whitelistedOrigins = process.env.WHITELISTED_CORS;
    const origin = req.header('Origin');
    if (!whitelistedOrigins.includes(origin)) {
      throw new UnauthorizedException([
        'This is CORS-enabled for a whitelisted domain.',
      ]);
    }
    next();
  }
}
