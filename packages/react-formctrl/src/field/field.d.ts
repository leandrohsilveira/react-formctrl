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
     * 	A function responsible for transforming the Field component injection properties into an object containing as key the name of the property to be injected and the value of the property: (field) => ({injectedOnChange: field.onChange})
     */
    inject?(field: DefaultFieldInjectedProps): CustomPropertiesInjection;

}

declare interface FieldState extends FieldStateController {

}

declare class Field extends React.Component<FieldProps, FieldState> {

    onChange(fieldCtrl: FieldStateController): void;

    handleFieldChangeForward(event: CustomEvent): void;

    handleChange(event: FieldEvent): void;

    handleBlur(event: FieldEvent): void

    sync(fieldCtrl: FieldStateController): any;

    getChildProps(): DefaultFieldInjectedProps;

    inject(): CustomPropertiesInjection;

}