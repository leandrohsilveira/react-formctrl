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
     * event handler to change event (Automatically handled by react-formctrl)
     */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;

    /**
     * event handler to blur event (Automatically handled by react-formctrl)
     */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;

    /**
     * The field state controller (Automatically handled by react-formctrl)
     */
    ctrl?: FieldStateController;

}

declare interface ControlledFieldDecorator extends ClassDecorator {
    (component: React.ComponentType<ControlledFieldProps>): React.ComponentClass<ControlledFieldProps>;
}

declare function controlledField(): ControlledFieldDecorator;
