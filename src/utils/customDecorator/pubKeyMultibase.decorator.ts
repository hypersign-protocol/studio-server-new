import {
    applyDecorators,
    SetMetadata,
    BadRequestException,
  } from '@nestjs/common';
  
  export const ValidatePublicKeyMultibase = (): PropertyDecorator => {
    return applyDecorators(
      SetMetadata('validatePublicKeyMultibase', true),
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
            const multibaseBase58Regex = /^z([1-9A-HJ-NP-Za-km-z]+)$/;
           if(!multibaseBase58Regex.test(val)){
            throw new BadRequestException([
                `${propertyKey.toString()} is not a multibase publicKey`,
              ]);           }
  
            original = val;
          },
        };
        Object.defineProperty(target, propertyKey, descriptor);
      },
    );
  };
  