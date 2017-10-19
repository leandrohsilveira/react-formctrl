import * as React from 'react';

import { DefaultFieldInjectedProps, CustomPropertiesInjection, FieldStateController, FieldStateProperties, FieldEvent } from '../provider/provider';

declare interface BaseFieldProps extends React.Props<any> {
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
}

declare interface BaseFieldState extends FieldStateController {


}

declare abstract class BaseField<P extends BaseFieldProps, S extends BaseFieldState> extends React.Component<P, S> {

        protected abstract getFieldId(): string;

        protected abstract dispatchRegisterField(): void;

        protected abstract dispatchUnregisterField(): void;

        protected abstract dispatchFieldPropsChanged(nextFieldProps: FieldStateProperties): void;

        protected abstract dispatchFieldChanged(value: string, files: FileList): void;

        protected abstract dispatchFieldBlur(newState: S): void;

        private onChange(fieldCtrl: FieldStateController): void;
    
        private handleFieldChangeForward(event: CustomEvent): void;
    
        private handleChange(event: FieldEvent): void;
    
        private handleBlur(event: FieldEvent): void
    
        private inject(): CustomPropertiesInjection;

        protected getChildProps(): DefaultFieldInjectedProps;
    
}