import * as React from 'react';
import { FieldStateProperties } from '../provider/provider';

declare interface ControlledFormProps {

    /**
     * The name of the form to control
     */
    form: string;

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

}

declare interface ControlledFieldDecorator extends ClassDecorator {
    (component: React.ComponentType<ControlledFieldProps>): React.ComponentClass<ControlledFieldProps>;
}

declare function controlledField(): ControlledFieldDecorator;
