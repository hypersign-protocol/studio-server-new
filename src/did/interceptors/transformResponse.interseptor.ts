import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Did } from '../schemas/did.schema';
export interface Response {
  totalDidCount: number;
  data: Array<Did['did']>;
}
@Injectable()
export class DidResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((data) => {
        const modifiedResponse = {
          totalDidCount: data[0]['totalDidCount'][0].total,
          data: this.mapData(data[0]['data']),
        };
        return modifiedResponse;
      }),
    );
  }
  mapData(data) {
    return data.map((Did) => Did.did);
  }
}
