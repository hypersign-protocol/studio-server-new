import {
  applyDecorators,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';

export const ValidateVerificationMethodId = (): PropertyDecorator => {
  return applyDecorators(
    SetMetadata('validateVerificationMethodId', true),
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

          const did = val.split('#')[0];
          if (!did.includes('did:hid:')) {
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
