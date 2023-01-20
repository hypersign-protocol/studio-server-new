import {
  HttpException,
  Injectable,
  NestMiddleware,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ValidateHeadersMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const userId = req.headers.userid;
    if (!userId) {
      throw new HttpException('No userId is passed', HttpStatus.BAD_REQUEST);
    }
    console.log('Dummy ValidateHeadersMiddleware');
    req.userId = userId;
    next();
  }
}
