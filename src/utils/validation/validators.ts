import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Checks if each value in an array is unique.
 *
 * @param validationOptions Validation options.
 */
export const IsUnique =
  (validationOptions?: ValidationOptions) =>
  (object: Object, propertyName: string): void =>
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      options: {
        message: 'each value in the array must be unique',
        ...validationOptions,
      },
      validator: {
        validate: (items: any[]): boolean => {
          if (!items) {
            return false;
          }

          if (new Set(items).size !== items.length) {
            return false;
          }

          return true;
        },
      },
    });
