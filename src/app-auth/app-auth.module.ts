import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppAuthService } from './services/app-auth/app-auth.service';
import { AppAuthController } from './controllers/app-auth/app-auth.controller';
import { ValidateHeadersMiddleware  } from './middlewares/validate-headers/validate-headers.middleware';
@Module({
  providers: [AppAuthService],
  controllers: [AppAuthController]
})
export class AppAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //// Appy middleware on all routes 
    consumer
      .apply(ValidateHeadersMiddleware)
      .forRoutes(AppAuthController);

    //// or Apply on specific routes
    // consumer.apply(ValidateHeadersMiddleware).forRoutes({
    //     path: '/app-auth/register',
    //     method: RequestMethod.POST,
    // })
  }
}
