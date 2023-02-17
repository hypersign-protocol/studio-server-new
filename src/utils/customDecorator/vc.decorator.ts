import {
  applyDecorators,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';

export const IsVcId = (): PropertyDecorator => {
  return applyDecorators(
    SetMetadata('IsVcId', true),
    (target: object, propertyKey: string | symbol) => {
      let original = target[propertyKey];
      const descriptor: PropertyDescriptor = {
        get: () => original,
        set: (val: any) => {
          if (val.trim() === '') {
            throw new BadRequestException([
              `${propertyKey.toString()} cannot be empty`,
            ]);
          }

          const vcId = val;
          if (!vcId.includes('vc:hid:')) {
            throw new BadRequestException([
              `Invalid ${propertyKey.toString()}`,
            ]);
          }
          if (vcId.includes('.')) {
            throw new BadRequestException([
              `Invalid ${propertyKey.toString()}`,
            ]);
          }
          original = val;
        },
      };
      Object.defineProperty(target, propertyKey, descriptor);
    },
  );
};
