import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PeopleService } from './services/people.service';
import { PeopleController } from './controller/people.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminPeople, AdminPeopleSchema } from './schema/people.schema';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/services/user.service';
// import { Invite, InviteSchema } from './schema/invite.schema';
import { AdminPeopleRepository } from './repository/people.repository';
// import { InviteRepository } from './repository/invite.respository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminPeople.name, schema: AdminPeopleSchema },
    ]),

    UserModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService, UserService, AdminPeopleRepository],
})
export class PeopleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTAuthorizeMiddleware).forRoutes(PeopleController);
  }
}
