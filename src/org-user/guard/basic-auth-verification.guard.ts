import {
  Injectable,
  UnauthorizedException,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
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

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
