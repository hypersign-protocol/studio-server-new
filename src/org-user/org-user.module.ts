import { Module } from '@nestjs/common';
import { OrgUserService } from './org-user.service';
import { OrgUserController } from './org-user.controller';
import { BasicAuthStrategy } from './strategy/basic-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/utils/session/session.serializer';
@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [OrgUserController],
  providers: [OrgUserService, BasicAuthStrategy, SessionSerializer],
})
export class OrgUserModule {}
