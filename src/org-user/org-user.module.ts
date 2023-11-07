import { Module } from '@nestjs/common';
import { OrgUserService } from './org-user.service';
import { OrgUserController } from './org-user.controller';
import { BasicAuthStrategy } from './strategy/basic-auth.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [PassportModule],
  controllers: [OrgUserController],
  providers: [OrgUserService, BasicAuthStrategy],
})
export class OrgUserModule {}
