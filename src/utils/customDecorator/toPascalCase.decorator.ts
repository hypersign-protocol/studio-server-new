import { applyDecorators, SetMetadata } from "@nestjs/common";


declare global {
  interface String{
    toPascalCase():string
  }
}

String.prototype.toPascalCase = function() {
  return this
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), s => s.toUpperCase());
};
export const ToPascalCase = (): PropertyDecorator => {
    return applyDecorators(
      SetMetadata('toPascalCase', true),
      (target: Object, propertyKey: string | symbol) => {
        let original = target[propertyKey];
        const descriptor: PropertyDescriptor = {
          get: () => original,
          set: (val: string) => {
           
            original = val.toPascalCase()               
          },
  
        };
        Object.defineProperty(target, propertyKey, descriptor);
      },
    );
  };


  export {}