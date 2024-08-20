import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthZCredits, AuthZCreditsSchema } from './schemas/authz.schema';
import { AuthZCreditsRepository } from './repositories/authz.repository';
import { AuthzCreditService } from './services/credits.service';
import { CreditsController } from './controllers/credits.controller';
import { JWTAuthorizeMiddleware } from 'src/utils/middleware/jwt-authorization.middleware';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AuthZCredits.name, schema: AuthZCreditsSchema },
    ]),
  ],
  controllers: [CreditsController],
  providers: [AuthZCreditsRepository, AuthzCreditService],

  exports: [AuthZCreditsRepository, AuthzCreditService],
})
export class CreditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTAuthorizeMiddleware).forRoutes(CreditsController);
  }
}
