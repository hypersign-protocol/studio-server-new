import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoolgeLoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async googleLogin(req) {
    Logger.log('googleLogin() starts', 'GoolgeLoginService');
    const { email, name } = req.user;
    let userInfo = await this.userRepository.findOne({
      email,
    });
    let appUserID;
    if (!userInfo) {
      appUserID = uuidv4();
      userInfo = await this.userRepository.create({
        email,
        userId: appUserID,
      });
    }
    const payload = {
      name,
      email,
      appUserID: userInfo.userId,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret,
    });
    return {
      status: 200,
      token: token,
    };
  }
}
