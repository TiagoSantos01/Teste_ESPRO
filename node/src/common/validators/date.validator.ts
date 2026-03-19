import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidBirthDate', async: false })
export class IsValidBirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!isoDateRegex.test(value)) {
      return false;
    }
    const [yearStr, monthStr, dayStr] = value.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (year < 1000 || year > 9999) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const date = new Date(Date.UTC(year, month - 1, day));
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth() + 1;
    const utcDay = date.getUTCDate();

    if (utcYear !== year || utcMonth !== month || utcDay !== day) {
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    if (year < 1900 || year > currentYear) {
      return false;
    }
    if (year === currentYear) {
      if (month > currentMonth) {
        return false;
      }
      if (month === currentMonth && day > currentDay) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'Data de nascimento deve estar no formato YYYY-MM-DD e ser uma data válida';
  }
}

export function IsValidBirthDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBirthDateConstraint,
    });
  };
}
