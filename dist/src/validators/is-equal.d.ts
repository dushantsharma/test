import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsEqualConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: any): boolean;
    defaultMessage(args: any): string;
}
export declare function IsEqual(property: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
