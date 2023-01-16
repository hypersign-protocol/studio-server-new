import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppAuthService } from './services/app-auth/app-auth.service';
import { AppAuthController } from './controllers/app-auth/app-auth.controller';
import { ValidateHeadersMiddleware  } from './middlewares/validate-headers/validate-headers.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { AppRepository  } from './repositories/app.repository';
@Module({
  imports: [MongooseModule.forFeature([{ name: App.name,  schema: AppSchema }])],
  providers: [AppAuthService, AppRepository],
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
