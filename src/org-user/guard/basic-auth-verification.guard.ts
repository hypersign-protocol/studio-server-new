import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthVerificationGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any) {
    Logger.log({
      err,
      user,
    });

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException([
          'Basic authorization token is missing in header or could not be verified',
        ])
      );
    }
    return user;
  }
}
