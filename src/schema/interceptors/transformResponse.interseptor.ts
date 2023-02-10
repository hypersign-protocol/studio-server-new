import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Schemas } from '../schemas/schemas.schema';
export interface Response {
  totalSchemaCount: number;
  data: Array<Schemas['schemaId']>;
}
@Injectable()
export class SchemaResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((data) => {
        const modifiedResponse = {
          totalSchemaCount: data[0]['totalSchemaCount'][0].total,
          data: this.mapData(data[0]['data']),
        };
        return modifiedResponse;
      }),
    );
  }
  mapData(data) {
    return data.map((schema) => schema.schemaId);
  }
}
