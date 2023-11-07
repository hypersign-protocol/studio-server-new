import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly config: ConfigService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    Logger.log({
      username,
      password,
    });

    const userInEnv = {
      username: 'vishwas',
      password: '123@',
    };

    if (!username || !password) {
      throw new UnauthorizedException('Username or password not passed');
    }

    if (username !== userInEnv.username) {
      throw new UnauthorizedException('Username not found');
    }

    if (password !== userInEnv.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      username,
      password,
    };
  }
}
