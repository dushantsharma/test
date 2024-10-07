"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEqualConstraint = void 0;
exports.IsEqual = IsEqual;
const class_validator_1 = require("class-validator");
let IsEqualConstraint = class IsEqualConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        return value === relatedValue;
    }
    defaultMessage(args) {
        return `${args.property} must match with ${args.constraints[0]}`;
    }
};
exports.IsEqualConstraint = IsEqualConstraint;
exports.IsEqualConstraint = IsEqualConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isEqual', async: false })
], IsEqualConstraint);
function IsEqual(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isEqual',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: IsEqualConstraint,
        });
    };
}
//# sourceMappingURL=is-equal.js.map