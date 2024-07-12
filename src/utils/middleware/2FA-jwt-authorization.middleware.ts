import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TwoFAAuthorizationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      'Inside TwoFAAuthorizationMiddleware',
      'TwoFAAuthorizationMiddleware',
    );
    if (!req['user'] || Object.keys(req['user']).length === 0) {
      throw new UnauthorizedException(['User not authenticated']);
    }
    const user = req['user'];
    if (user['authenticators'] && user['authenticators'].length > 0) {
      if (!user['isTwoFactorAuthenticated']) {
        throw new UnauthorizedException(['2FA authentication is required']);
      }
    }
    next();
  }
}
