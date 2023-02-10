import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PresentationTemplate } from '../schemas/presentation-template.schema';
export interface Response {
  totalTemplatesCount: number;
  data: Array<PresentationTemplate>;
}
@Injectable()
export class TemplateResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((data) => {
        const modifiedResponse = {
          totalTemplatesCount: data[0]['totalTemplatesCount'][0].total,
          data: data[0].data,
        };
        return modifiedResponse;
      }),
    );
  }
}
