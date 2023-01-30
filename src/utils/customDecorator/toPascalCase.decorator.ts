import { applyDecorators, SetMetadata } from "@nestjs/common";


export const ToPascalCase = (): PropertyDecorator => {
    return applyDecorators(
      SetMetadata('toPascalCase', true),
      (target: Object, propertyKey: string | symbol) => {
        let original = target[propertyKey];
        const descriptor: PropertyDescriptor = {
          get: () => original,
          set: (val: any) => {
            original = val.replace(/\w\S*/g,m=>m.charAt(0).toUpperCase()+m.substring(1).toLocaleLowerCase())                    
          },
  
        };
        Object.defineProperty(target, propertyKey, descriptor);
      },
    );
  };