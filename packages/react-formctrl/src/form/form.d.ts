import * as React from 'react';
import { FormStateController, InjectedFormStateController, CustomPropertiesInjection } from '../provider/provider';

declare interface FormProps extends React.Props<any> {
    /**
     * The name of the form to be registered.
     */
    name: string;

    /**
     * The CSS classes to apply to native form component rendered by this component.
     */
    className?: string;

    /**
     * The form submit handler.
     */
    onSubmit?(values: {[fieldName: string]: string}, formCtrl?: FormStateController): void;
}

declare interface FormState {
    ref: string;
}

declare class Form extends React.Component<FormProps, FormState> {

    handleSubmit(event: React.FormEvent<any>): void;

    handleReset(event: React.FormEvent<any>): void;

    handleFormSubmitForward(event: CustomEvent): void;

}

declare interface FormControlProps extends React.Props<any> {

    /**
     * The form name reference to watch it's controller and inject into child component properties.
     */
    form: string;

    /**
     * The form values change event handler.
     */
    onChange?(formCtrl: FormStateController): void;

    /**
     * A function responsible for transforming the form controller into an object containing as key the name of the property to be injected and the value of the property: (formCtrl) => ({injectedFormNameProp: formCtrl.formName})
     */
    inject?(formCtrl: InjectedFormStateController): CustomPropertiesInjection;

}

declare interface FormControlState extends FormStateController, React.Props<any> {

}

export class FormControl extends React.Component<FormControlProps, FormControlState> {

    onChange(formCtrl: FormStateController): void;

    handleFormChanged(event: CustomEvent): void;

    sync(formCtrl: FormStateController): any;

    setFieldValue(fieldName: string, newValue: string): void;

    inject(): {[propertyInjectionName: string]: any};

}