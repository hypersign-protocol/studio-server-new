import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidateHeadersMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Dummy ValidateHeadersMiddleware');
    next();
  }
}
