import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class HypersignAuthenticateMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      'Inside HypersignAuthenticateMiddleware; before calling hs auth authenticate()',
      'HypersignAuthenticateMiddleware',
    );
    const userId = uuidv4(); // can't generate userId here fetch userId based on email and use that userID
    return globalThis.hypersignAuth.authenticate(req, res, next, userId);
  }
}
