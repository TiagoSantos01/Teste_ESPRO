import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsInicioMenorQueFim(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInicioMenorQueFim',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedName] = args.constraints;
          const relatedValue = (args.object as any)[relatedName];

          if (value == null || relatedValue == null) return true;
          if (typeof value !== 'string' || typeof relatedValue !== 'string') return false;
          if (!/^\d{2}:\d{2}$/.test(value) || !/^\d{2}:\d{2}$/.test(relatedValue)) return false;

          const toMinutes = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
          };

          return toMinutes(value) < toMinutes(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return 'O campo início deve ser anterior ao campo fim.';
        },
      },
    });
  };
}