import * as React from 'react';

import { DefaultFieldInjectedProps, CustomPropertiesInjection, FieldStateController, FieldEvent, FieldStateProperties } from '../provider/provider';

import { BaseFieldProps, BaseFieldState, BaseField } from './base-field'


declare interface FieldProps extends BaseFieldProps {

    /**
     * 	The name of the field.
     */
    name: string;

    /**
     * 	The name of the field's form.
     */
    form: string;

}

declare interface FieldState extends BaseFieldState {

}

declare class Field extends BaseField<FieldProps, FieldState> {

    protected getFieldId(): string;
    
    protected dispatchRegisterField(): void;

    protected dispatchUnregisterField(): void;

    protected dispatchFieldPropsChanged(nextFieldProps: FieldStateProperties): void;

    protected dispatchFieldChanged(value: string, files: FileList): void;

    protected dispatchFieldBlur(newState: FieldState): void;

}