import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthProvider } from 'src/user/schema/user.schema';

export class HypersignAuthDataTransformerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { data } = req.body['hypersign'];
    req['user'] = {
      userId: data.appUserID,
      email: data.email,
      did: data['id'],
      name: data['name'],
      // provider: AuthProvider.hypersign
    };

    return next();
  }
}
