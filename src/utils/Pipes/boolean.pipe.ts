import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";

export class BooleanPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else {
        throw new BadRequestException(['Value must be true or false']);
      }
    }
  }