import {FormEventDispatcher} from './provider'
import {copyFieldCtrl, copyFieldCtrlProps, copyFiles} from './provider.utils'

export const REACT_FORMCTRL_NAME = 'react-formctl'

export const REACT_FORMCTRL = {
    EVENTS: {
        REGISTER_FORM: `${REACT_FORMCTRL_NAME}.registerForm`,
        UNREGISTER_FORM: `${REACT_FORMCTRL_NAME}.unregisterForm`,
        REGISTER_FIELD: `${REACT_FORMCTRL_NAME}.registerField`,
        UNREGISTER_FIELD: `${REACT_FORMCTRL_NAME}.unregisterField`,
        FORM_CHANGED: `${REACT_FORMCTRL_NAME}.formChanged`,
        FIELD_CHANGED: `${REACT_FORMCTRL_NAME}.fieldChanged`,
        FIELD_PROPS_CHANGED: `${REACT_FORMCTRL_NAME}.fieldPropsChanged`,
        FIELD_BLURRED: `${REACT_FORMCTRL_NAME}.fieldBlurred`,
        REGISTER_FIELD_ARRAY: `${REACT_FORMCTRL_NAME}.registerFieldArray`,
        UNREGISTER_FIELD_ARRAY: `${REACT_FORMCTRL_NAME}.unregisterFieldArray`,
        FIELD_ARRAY_CHANGED: `${REACT_FORMCTRL_NAME}.fieldArrayChanged`,
        PUSHED_FIELD_ENTRY: `${REACT_FORMCTRL_NAME}.pushedFieldArray`,
        REMOVED_FIELD_ENTRY: `${REACT_FORMCTRL_NAME}.removedFieldArray`,
        FORM_SUBMITED: `${REACT_FORMCTRL_NAME}.formSubmited`,
        FORM_RESETED: `${REACT_FORMCTRL_NAME}.formReseted`,
        REGISTER_VALIDATORS: `${REACT_FORMCTRL_NAME}.registerValidators`,
    }
}

export function onRegisterForm(form) {
    return { 
        type: REACT_FORMCTRL.EVENTS.REGISTER_FORM, 
        payload: {form}
    }
}

export function onUnregisterForm(form) {
    return { 
        type: REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, 
        payload: {form}
    }
}

export function onSubmitForm(form, formRef) {
    return { 
        type: REACT_FORMCTRL.EVENTS.FORM_SUBMITED, 
        payload: {form, formRef}
    }
}

export function onResetForm(form) {
    return { 
        type: REACT_FORMCTRL.EVENTS.FORM_RESETED, 
        payload: {form}
    }
}

export function onRegisterField(form, field, fieldCtrl) {
    return { 
        type: REACT_FORMCTRL.EVENTS.REGISTER_FIELD, 
        payload: {form, field, fieldCtrl: copyFieldCtrl(fieldCtrl)}
    }
}

export function onUnregisterField(form, field) {
    return { 
        type: REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, 
        payload: {form, field}
    }
}

export function onFieldPropsChanged(form, field, props) {
    return { 
        type: REACT_FORMCTRL.EVENTS.FIELD_PROPS_CHANGED, 
        payload: {form, field, props: copyFieldCtrlProps(props)}
    }
}

export function onFieldChanged(form, field, value, files) {
    return { 
        type: REACT_FORMCTRL.EVENTS.FIELD_CHANGED, 
        payload: {form, field, value, files: copyFiles(files)}
    }
}

export function onFieldBlur(form, field) {
    return { 
        type: REACT_FORMCTRL.EVENTS.FIELD_BLURRED, 
        payload: {form, field}
    }
}

export function onRegisterValidators(validators) {
    return {
        type: REACT_FORMCTRL.EVENTS.REGISTER_VALIDATORS,
        payload: {validators}
    }
}

export function onRegisterFieldArray(form, name, withEmptyEntry, initialValues) {
    return {
        type: REACT_FORMCTRL.EVENTS.REGISTER_FIELD_ARRAY,
        payload: {form, name, withEmptyEntry, initialValues}
    }
}

export function onUnregisterFieldArray(form, name) {
    return {
        type: REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD_ARRAY,
        payload: {form, name}
    }
}

export function onFieldArrayEntryPush(form, name, initialValues) {
    return {
        type: REACT_FORMCTRL.EVENTS.PUSHED_FIELD_ENTRY,
        payload: {form, name, initialValues}
    }
}

export function onFieldArrayEntryRemove(form, name, index) {
    return {
        type: REACT_FORMCTRL.EVENTS.REMOVED_FIELD_ENTRY,
        payload: {form, name, index}
    }
}