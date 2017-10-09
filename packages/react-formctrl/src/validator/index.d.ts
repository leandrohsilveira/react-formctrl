import {FormStateController, FieldStateProperties, ValidationError} from '../provider/provider'

declare interface Validator {

    shouldValidate(formCtrl: FormStateController, props: FieldStateProperties, value: string, files: File[]): boolean;

    validate(formCtrl: FormStateController, props: FieldStateProperties, value: string, files: File[]): boolean|{[key: string]: any};

    createValidationError(value: string, files: File[], params: {[key:string]: any}): ValidationError;

}