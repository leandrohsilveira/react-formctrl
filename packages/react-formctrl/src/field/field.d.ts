import * as React from 'react';

import { DefaultFieldInjectedProps, CustomPropertiesInjection, FieldStateController, FieldEvent } from '../provider/provider';

declare interface FieldProps extends React.Props<any> {

    /**
     * 	The name of the field.
     */
    name: string;

    /**
     * 	The name of the field's form.
     */
    form: string;

    /**
     * 	The CSS class to inject into it's component child.
     */
    className?: string;

    /**
     * true if the field is required.
     */
    required?: boolean;

    /**
     * The regex to validate the field value.
     */
    pattern?: string|RegExp;

    /**
     * text	The input field type. Supports all types, but currently only the "email" and "number" types has out of the box validation.
     */
    type?: string;

    /**
     * true if when the Field type property is "number" and should validate to integer value.
     */
    integer?: boolean;

    /**
     * the name of the field of the same form that the value of this field should match.
     */
    match?: string;

    /**
     * The min Number value of a field with type "number".
     */
    min?: number|string;

    /**
     * The max Number value of a field with type "number".
     */
    max?: number|string;

    /**
     * The min string value length of a field.
     */
    minLength?: number|string;

    /**
     * The max string value length of a field.
     */
    maxLength?: number|string;

    /**
     * 	A function responsible for transforming the Field component injection properties into an object containing as key the name of the property to be injected and the value of the property: (field) => ({injectedOnChange: field.onChange})
     */
    inject?(field: DefaultFieldInjectedProps): CustomPropertiesInjection;

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

    /**
     * The field's initial value
     */
    initialValue?: string|number|Date;

    /**
     * a change event interceptor
     */
    onChange?(fieldCtrl?: FieldStateController): void;

    /**
     * a form reset event interceptor
     */
    onReset?(fieldCtrl?: FieldStateController): void;

    /**
     * a blur event interceptor
     */
    onBlur?(fieldCtrl?: FieldStateController): void;

}

declare interface FieldState extends FieldStateController {

}

declare class Field extends React.Component<FieldProps, FieldState> {

    onChange(fieldCtrl: FieldStateController): void;

    onReset(fieldCtrl: FieldStateController): void;

    onBlur?(fieldCtrl: FieldStateController): void;

    handleFieldChangeForward(event: CustomEvent): void;

    handleChange(event: FieldEvent): void;

    handleBlur(event: FieldEvent): void

    sync(fieldCtrl: FieldStateController): any;

    getChildProps(): DefaultFieldInjectedProps;

    inject(): CustomPropertiesInjection;

}