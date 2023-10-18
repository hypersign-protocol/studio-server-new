import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AtLeastOneParamPipe implements PipeTransform {
  constructor(private readonly allowedParams: string[]) {}
  transform(value: any) {
    const presentParams = this.allowedParams.filter((param) => value[param]);
    if (presentParams.length === 0) {
      const requiredParams = this.allowedParams.join(' or ');
      throw new BadRequestException([
        `At least one of the ${requiredParams} is required`,
      ]);
    }

    return value;
  }
}
