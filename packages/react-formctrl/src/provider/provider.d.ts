import * as React from 'react';

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
    (event: FieldEvent): void;
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
    name?: String;

    /**
     * The name of the field's form.
     */
    form?: String;

    /**
     * The CSS class to inject into it's component child.
     */
    className?: String;

    /**
     * false
     */
    required?: boolean;

    /**
     * RegExp	The regex to validate the field value.
     */
    pattern?: String;

    /**
     * The input field type.
     */
    type?: String;

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
    value?: String;

    /**
     * The field controller.
     */
    ctrl?: FieldStateController;

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
     * 
     * {String: String}	The fields values of the form: {[fieldName]: [fieldValue]}.
     */
    values: {[fieldName: string]: string};

    /**
     * 
     * {String: FieldCtrl}	The fields controllers of the form: {[fieldName]: [fieldCtrl]}
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
     * The min String value length of a field.
     */
    minLength?: number;

    /**
     * The max String value length of a field.
     */
    maxLength?: number;	
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
     * An array of Strings with all current validation errors of the field.
     */
    errors: string[];

    /**
     * Some properties of the Field.
     */
    props?: FieldStateProperties;

}

declare interface FormProviderProps extends React.Props<any> {

}

declare interface FormProviderState {
    forms: {[formName: string]: FormStateController}
}

export class FormProvider extends React.Component<FormProviderProps, FormProviderState> {

    subscribe(): void;

    onEvent(event: CustomEvent): void;

    onRegisterForm(formName: string): void;

    onRegisterField(formName: string, fieldName: string, fieldCtrl: FieldStateController): void;

    onUnregisterForm(formName: string): void;

    onUnregisterField(formName: string, fieldName: string): void;

    onFieldChanged(formName: string, fieldName: string, value: string): void;

    onFieldPropsChanged(formName: string, fieldName: string, props: FieldStateProperties): void;

    onFieldBlurred(formName: string, fieldName: string): void;
    
    updateFormCtrl(formName: string, formCtrl: FormStateController): void;

    updateFieldCtrl(formName: string, fieldCtrl: FieldStateController, value: string): void;

    onFormSubmited(formName: string, formRef: string): void;

    onFormReseted(formName: string): void;

    unsubscribe(): void;

}