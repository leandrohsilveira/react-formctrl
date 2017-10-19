import * as React from 'react';

import { FieldStateProperties } from '../provider/provider'

import { BaseFieldProps, BaseFieldState, BaseField } from './base-field'

declare interface EntryProps {

    form: string;

    group: string;

    index: number;

}

declare interface FieldArrayEntryProps extends BaseFieldProps {

    /**
     * 	The entry of the field array entry.
     */
    entry: EntryProps;

}

declare interface FieldArrayEntryState extends BaseFieldState {

}

declare class FieldArrayEntry extends BaseField<FieldArrayEntryProps, FieldArrayEntryState> {

    protected getFieldId(): string;

    protected dispatchRegisterField(): void;

    protected dispatchUnregisterField(): void;

    protected dispatchFieldPropsChanged(nextFieldProps: FieldStateProperties): void;

    protected dispatchFieldChanged(value: string, files: FileList): void;

    protected dispatchFieldBlur(newState: FieldArrayEntryState): void;

}