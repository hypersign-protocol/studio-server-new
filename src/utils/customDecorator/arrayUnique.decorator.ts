import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'areAllPropertiesUnique', async: false })
export class AreAllPropertiesUniqueConstraint
  implements ValidatorConstraintInterface
{
  validate(array: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(array)) return false;

    const uniqueItems = new Set();

    for (const item of array) {
      const itemString = JSON.stringify(item);
      if (uniqueItems.has(itemString)) {
        return false; // Duplicate combination found
      }
      uniqueItems.add(itemString);
    }

    return true; // All objects have unique property combinations
  }

  defaultMessage(args: ValidationArguments): string {
    return `Each object in the array must have a unique combination of property values.`;
  }
}

export function AreAllPropertiesUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AreAllPropertiesUniqueConstraint,
    });
  };
}
