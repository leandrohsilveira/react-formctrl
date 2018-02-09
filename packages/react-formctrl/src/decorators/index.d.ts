import * as React from 'react';
import { FieldStateProperties, FieldStateController, FormStateController } from '../provider/provider';

declare interface ControlledFormProps {

    /**
     * The name of the form to control
     */
    form: string;

    /**
     * The form state controller
     */
    formCtrl?: FormStateController;

    /**
     * Change a field value of this form
     */
    setFieldValue?(fiendName: string, fieldValue: string | number | Date): void;

}

declare interface ControlledFormDecorator extends ClassDecorator {
    (Component: React.ComponentType<ControlledFormProps>): React.ComponentClass<ControlledFormProps>;
}

declare function controlledForm(): ControlledFormDecorator;

declare interface ControlledFieldProps extends FieldStateProperties {

    /**
     * The form name to attach the field
     */
    form: string;

    /**
     * The name of the field
     */
    name: string;

    /**
     * The field initial value
     */
    initialValue?: string | number | Date;

    /**
     * The field value (Automatically handled by react-formctrl)
     */
    value?: string | number;

    /**
     * The field state controller (Automatically handled by react-formctrl)
     */
    ctrl?: FieldStateController;

    /**
     * Internally in the controlledField() component, this event handler is injected and automatically handled by react-formctrl.
     */
    onChange?: React.ChangeEventHandler<any>;

    /**
     * Internally in the controlledField() component, this event handler is injected and automatically handled by react-formctrl.
     */
    onBlur?: React.FocusEventHandler<any>;

    /**
     * An extra change event handler called after "react-formctrl" state change cycle.
     */
    afterChange?(fieldCtrl?: FieldStateController): void;

    /**
     * An extra blur event handler called after "react-formctrl" state change cycle.
     */
    afterBlur?(fieldCtrl?: FieldStateController): void;

    /**
     * Handler called when the form that this field is attached is reseted.
     */
    afterReset?(fieldCtrl?: FieldStateController): void;

}

declare interface ControlledFieldDecorator extends ClassDecorator {
    (component: React.ComponentType<ControlledFieldProps>): React.ComponentClass<ControlledFieldProps>;
}

declare function controlledField(): ControlledFieldDecorator;
