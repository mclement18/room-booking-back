import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsLaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLaterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        ...validationOptions,
        message: `${propertyName} is older than ${property}`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return Number(new Date(value)) > Number(new Date(relatedValue));
        },
      },
    });
  };
}
