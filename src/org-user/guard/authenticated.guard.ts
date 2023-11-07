import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    Logger.log('Inside AuthenticatedGuard', 'AuthenticatedGuard');
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
