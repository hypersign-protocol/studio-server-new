import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SupportedServiceService } from './services/supported-service.service';
import { SupportedServiceController } from './controller/supported-service.controller';
import { HypersignAuthorizeMiddleware } from 'src/utils/middleware/hypersign-authorize.middleware';

@Module({
  controllers: [SupportedServiceController],
  providers: [SupportedServiceService],
})
export class SupportedServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HypersignAuthorizeMiddleware)
      .exclude({
        path: '/api/v1/app/services',
        method: RequestMethod.GET,
      })
      .forRoutes(SupportedServiceController);
  }
}
