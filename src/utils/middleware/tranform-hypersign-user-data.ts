import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export class HypersignAuthDataTransformerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const {} = req.body;
    const { data } = req.body['hypersign'];
    const userId = data.email;

    req['user'] = {
      userId: data['email'],
      did: data['id'],
      name: data['name'],
    };

    return next();
  }
}
