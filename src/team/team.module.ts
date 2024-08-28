import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { TeamMember, TeamMemberSchema } from './schemas/teamMember.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      {
        name: TeamMember.name,
        schema: TeamMemberSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, UserRepository],
})
export class TeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTAuthorizeMiddleware).forRoutes(TeamController);
  }
}
