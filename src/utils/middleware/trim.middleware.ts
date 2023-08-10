import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class TrimMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    Logger.log('Middleware:: TrimMiddleware: trims whitspace');

    const requestBody = req.body;
    if (this.isObj(requestBody)) {
      req.body = this.trim(requestBody);
    }
    next();
  }
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(value: unknown) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      value.forEach((element, index) => {
        value[index] = this.trim(element);
      });
      return value;
    }

    if (this.isObj(value)) {
      Object.keys(value).forEach((key) => {
        value[key] = this.trim(value[key]);
      });
      return value;
    }

    return value;
  }
}
