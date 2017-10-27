import * as React from 'react';

import {Validator} from '../validator'

declare interface CustomPropertiesInjection {
    [propertyInjectionName: string]: any;
}

/**
 * A simplified HtmlElementEvent,
 */
declare interface FieldEvent {
    target: {name: string, value: string}    
}

/**
 * Event handler form FieldEvent type.
 */
declare interface FieldEventHandler {
    (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>): void;
}

/**
 * The type of "formCtrl" property injected by FormControl component.
 */
declare interface InjectedFormStateController extends FormStateController {

    /**
     * 	The name of the watched form.
     */
    formName: string;

    /**
     * 	Method to programmatically change a field value: props.formCtrl.setFieldValue('fieldName', 'newValue').
     */
    setFieldValue(fieldName: string, newValue:string): void;

}

/**
 * Default type of injected properties by FormControl component.
 */
declare interface DefaultFormControlInjectedProps {

    /**
     * The form controller
     */
    formCtrl?: InjectedFormStateController;
}

/**
 * Default type of injected properties by Field component.
 */
declare interface DefaultFieldInjectedProps {

    /**
     * The name of the field.
     */
    name?: string;

    /**
     * The name of the field's form.
     */
    form?: string;

    /**
     * The CSS class to inject into it's component child.
     */
    className?: string;

    /**
     * false
     */
    required?: boolean;

    /**
     * RegExp	The regex to validate the field value.
     */
    pattern?: string;

    /**
     * The input field type.
     */
    type?: string;

    /**
     * The field change event handler: (e) => handleChange(e.target.value).
     */
    onChange?: FieldEventHandler;

    /**
     * The field blur event handler: (e) => handleBlur(e.target.name).
     */
    onBlur?: FieldEventHandler;

    /**
     * The current field value.
     */
    value?: string;

    /**
     * The field controller.
     */
    ctrl?: FieldStateController;

}

declare interface ValidationError {

    /**
     * Validation error message key
     */
    key: string;

    /**
     * Validation error message parameters.
     */
    params?: {[paramName: string]: any}
}

/**
 * The state of a registered form in FormProvider component.
 */
declare interface FormStateController {

    /**
     * 	true if the form is valid.
     */
    valid: boolean;

    /**
     * 	true if the form is invalid.
     */
    invalid: boolean;

    /**
     * 	true if all fields of the form are untouched (field blur).
     */
    untouched: boolean;

    /**
     * 	true if any field of the form was touched (field blur).
     */
    touched: boolean;

    /**
     * 	true if all fields of the form never changed it's value since it's loaded or reseted.
     */
    pristine: boolean;

    /**
     * 	true if any field of the form has changed it's value one or more times since it's loaded or reseted.
     */
    dirty: boolean;

    /**
     * 	true if all fields values of the form are exactly equals it's initial values.
     */
    unchanged: boolean;

    /**
     * 	true if any field value of the form aren't exactly equals it's initial value.
     */
    changed: boolean;

    /**
     * {string: string}	The fields values of the form: {[fieldName]: [fieldValue]}.
     */
    values: {[fieldName: string]: string};

    /**
     * All selected files of each field of the form.
     */
    files: {[fieldName: string]: File[]};

    /**
     * {string: FieldCtrl}	The fields controllers of the form: {[fieldName]: [fieldCtrl]}
     */
    fields: {[fieldName: string]: FieldStateController};

}

/**
 * The properties of a registered form field on FormProvider.
 */
declare interface FieldStateProperties {

    /**
     * The input field type.
     */
    type?: string;
    
    /**
     * true if the input field is required.
     */
    required?: boolean;

    /**
     * 	The regex to validate the field pattern.
     */
    pattern?: string|RegExp;

    /**
     * Another field name that the value of this field should match.
     */
    match?: string;

    /**
     * true if when the Field type property is "number" and should validate to integer value.
     */
    integer?: boolean;

    /**
     * The min Number value of a field with type "number".
     */
    min?: number;

    /**
     * The max Number value of a field with type "number".
     */
    max?: number;

    /**
     * The min string value length of a field.
     */
    minLength?: number;

    /**
     * The max string value length of a field.
     */
    maxLength?: number;	

    /**
     * An array of custom validators registered on FormProvider component.
     */
    validate?: string|string[];

    /**
     * A collection of accepted mimetypes separated by comma.
     */
    accept?: string;
    
    /**
     * An array of accepted files extensions.
     */
    extensions?: string[];

    /**
     * The max file bytes size accepted.
     */
    maxSize?: number|string;

}

/**
 * The state of a field registered on FormProvider.
 */
declare interface FieldStateController {

    /**
     * true if the field is valid.
     */
    valid: boolean;
    /**
     * true if the field is invalid.
     */
    invalid: boolean;
    /**
     * true if the field is untouched (field blur).
     */
    untouched: boolean;
    /**
     * true if the field was touched (field blur).
     */
    touched: boolean;
    /**
     * true if the field never changed it's value since it's loaded or reseted.
     */
    pristine: boolean;
    /**
     * true if the field has changed it's value one or more times since it's loaded or reseted.
     */
    dirty: boolean;
    /**
     * true if the field value is exactly equals it's initial value.
     */
    unchanged: boolean;
    /**
     * true if the field value isn't exactly equals it's initial value.
     */
    changed: boolean;

    /**
     * The value of the field.
     */
    value: string;

    /**
     * All selected files of the field.
     */
    files: File[];

    /**
     * An array of ValidationError with all current validation errors of the field.
     */
    errors: ValidationError[];

    /**
     * Some properties of the Field.
     */
    props?: FieldStateProperties;

}

declare interface FormProviderProps extends React.Props<any> {

    validators?: Validator[];

}

declare interface FormProviderState {
    forms: {[formName: string]: FormStateController},
    validators?: any;
}

declare class FormProvider extends React.Component<FormProviderProps, FormProviderState> {

    onEvent(event: CustomEvent): void;

}