import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppRepository } from '../repositories/app.repository';
import { AppAuthSecretService } from '../services/app-auth-passord.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly appRepository: AppRepository,
    private readonly appAuthSecretService: AppAuthSecretService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload) {
    const appDetail = await this.appRepository.findOne({
      appId: payload.appId,
    });
    return appDetail;
  }
}

@Injectable()
export class JwtStrategyApp extends PassportStrategy(Strategy, 'jwtApp') {
  constructor(
    private readonly config: ConfigService,
    private readonly appRepository: AppRepository,
    private readonly appAuthSecretService: AppAuthSecretService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('WHITELISTED_CORS'),
    });
  }
  async validate(payload) {
    payload.userId = payload.email;
    return payload;
  }
}
