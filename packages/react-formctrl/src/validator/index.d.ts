import { FormStateController, FieldStateProperties, ValidationError } from '../provider/provider'

declare class Validator {

    constructor(validatorKey: string);

    shouldValidate(formCtrl: FormStateController, props: FieldStateProperties, value: string, files: File[]): boolean;

    validate(formCtrl: FormStateController, props: FieldStateProperties, value: string, files: File[]): boolean | { [key: string]: any };

    createValidationError(value: string, files: File[], params: { [key: string]: any }): ValidationError;

}

declare class CustomValidator extends Validator {

}