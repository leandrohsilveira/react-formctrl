
import { REACT_FORMCTRL } from './provider.actions'
import { validate, combineValidators } from '../validator'

const INTEGER_REGEX = /^-?\d+?$/
const FLOAT_REGEX = /^-?\d+(\.\d+)?$/
const EMAIL_REGEX = /\S+@\S+\.\S+/

export function formProviderReducer(state = { forms: {} }, action) {
    const type = action.type
    const payload = action.payload
    const EVENTS = REACT_FORMCTRL.EVENTS
    switch (type) {
        case EVENTS.REGISTER_FORM:
            return onRegisterForm(state, payload.form)
        case EVENTS.UNREGISTER_FORM:
            return onUnregisterForm(state, payload.form)
        case EVENTS.REGISTER_FIELD:
            return onRegisterField(state, payload.form, payload.field, payload.fieldCtrl)
        case EVENTS.UNREGISTER_FIELD:
            return onUnregisterField(state, payload.form, payload.field)
        case EVENTS.FIELD_CHANGED:
            return onFieldChanged(state, payload.form, payload.field, payload.value, payload.files)
        case EVENTS.FIELD_PROPS_CHANGED:
            return onFieldPropsChanged(state, payload.form, payload.field, payload.props)
        case EVENTS.FIELD_BLURRED:
            return onFieldBlurred(state, payload.form, payload.field)
        case EVENTS.FORM_SUBMITED:
            return onFormSubmited(state, payload.form, payload.formRef)
        case EVENTS.FORM_RESETED:
            return onFormReseted(state, payload.form)
        case EVENTS.REGISTER_FIELD_ARRAY:
            return onRegisterFieldArray(state, payload.form, payload.name, payload.withEmptyEntry, payload.initialValues)
        case EVENTS.UNREGISTER_FIELD_ARRAY:
            return onUnregisterFieldArray(state, payload.form, payload.name)
        case EVENTS.PUSHED_FIELD_ENTRY:
            return onFieldArrayEntryPush(state, payload.form, payload.name, payload.initialValues)
        case EVENTS.REMOVED_FIELD_ENTRY:
            return onFieldArrayEntryRemove(state, payload.form, payload.name, payload.index)
        case EVENTS.REGISTER_VALIDATORS:
            return { ...state, validators: combineValidators(payload.validators) }
        default:
            return state
    }
}

function onRegisterForm(state, formName) {
    const forms = { ...state.forms }
    if (forms[formName]) {
        const form = forms[formName]
        form.__instances++
    } else {
        forms[formName] = {
            __instances: 1,
            formName,
            valid: true,
            invalid: false,
            untouched: true,
            touched: false,
            pristine: true,
            dirty: false,
            unchanged: true,
            changed: false,
            fields: {},
            fieldsArrays: {},
            values: {},
            files: {}
        }
    }
    return { forms }
}

function onRegisterField(state, formName, fieldName, fieldCtrl, fieldArrName, index) {
    if (state.forms[formName]) {
        const forms = { ...state.forms }
        const form = forms[formName]
        if (form.fields[fieldName]) {
            fieldCtrl.__instances = form.fields[fieldName].__instances + 1
        } else {
            fieldCtrl.__instances = 1
        }
        updateFieldCtrl(state.validators, form, fieldCtrl, fieldCtrl.initialValue)
        form.fields[fieldName] = fieldCtrl
        form.values[fieldName] = fieldCtrl.value
        updateFormCtrl(form)
        return { forms }
    } else {
        console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
    }
    return state
}

function onUnregisterForm(state, formName) {
    const forms = { ...state.forms }
    const form = forms[formName]
    if (form.__instances > 1) {
        form.__instances--
    } else {
        delete forms[formName]
    }
    return { forms }
}

function onUnregisterField(state, formName, fieldName, fieldArrName, index) {
    if (state.forms[formName]) {
        if (state.forms[formName].fields[fieldName]) {
            const forms = { ...state.forms }
            const form = forms[formName]
            const field = form.fields[fieldName]
            if (field.__instances > 1) {
                field.__instances--
            } else {
                delete form.fields[fieldName]
            }
            return { forms }
        }
    }
    return state
}

function onFieldChanged(state, formName, fieldName, value, files) {
    if (state.forms[formName]) {
        if (state.forms[formName].fields[fieldName]) {
            const forms = { ...state.forms }
            const form = forms[formName]
            const fieldCtrl = form.fields[fieldName]
            fieldCtrl.dirty = true
            fieldCtrl.pristine = false
            updateFieldCtrl(state.validators, form, fieldCtrl, value, files)
            form.values[fieldName] = value
            form.files[fieldName] = files
            updateFormCtrl(form)
            return { forms }
        }
    }
    return state
}

function onFieldPropsChanged(state, formName, fieldName, props) {
    const forms = { ...state.forms }
    const form = forms[formName]
    const field = form.fields[fieldName]
    field.props = props
    updateFieldCtrl(state.validators, form, field, field.value)
    updateFormCtrl(form)
    return { forms }
}

function onFieldBlurred(state, formName, fieldName) {
    const forms = { ...state.forms }
    const form = forms[formName]
    const field = form.fields[fieldName]
    field.touched = true
    field.untouched = false
    updateFormCtrl(form)
    return { forms }
}

function onRegisterFieldArray(state, formName, fieldName, withEmptyEntry, initialValues) {
    const forms = { ...state.forms }
    const form = forms[formName]
    let fieldArrCtrl = form.fieldArrays[fieldName]
    if (fieldArrCtrl) {
        fieldArrCtrl.__instances += 1
    } else {
        fieldArrCtrl = {
            __instances: 1,
            fieldArrayName: fieldName,
            entries: withEmptyEntry ? [{form: formName, group: props.nameName, index: 0}] : [],
            valid: true,
            invalid: false,
            untouched: true,
            touched: false,
            pristine: true,
            dirty: false,
            unchanged: true,
            changed: false,
            fields: {},
            values: {},
            files: {}
        }
        form.fieldArrays[fieldName] = fieldArrCtrl
    }
    return { forms }
}

function onUnregisterFieldArray(state, formName, fieldName) {
    return onUnregisterField(state, formName, fieldName)
}

function onFieldArrayEntryPush(state, formName, fieldName, initialValues) {
    const forms = { ...state.forms }
    const form = forms[formName]
    const fieldArrCtrl = form[fieldName]

}

function onFieldArrayEntryRemove(state, formName, fieldName, index) {
}

function onFormSubmited(state, formName, formRef) {
    return state
}

function onFormReseted(state, formName) {
    const forms = { ...state.forms }
    const form = forms[formName]
    Object.keys(form.fields).forEach(fieldName => {
        const field = form.fields[fieldName]
        updateFieldCtrl(state.validators, form, field, field.initialValue)
        field.touched = false
        field.untouched = true
        field.dirty = false
        field.pristine = true
        form.values[fieldName] = field.initialValue
    })
    updateFormCtrl(form)
    return { forms }
}

function updateFormCtrl(form, fieldCtrl) {
    form.valid = true
    form.invalid = false
    form.untouched = true
    form.touched = false
    form.pristine = true
    form.dirty = false
    form.unchanged = true
    form.changed = false
    Object.keys(form.fields).forEach(fieldName => {
        const field = form.fields[fieldName]
        if (!field.valid) form.valid = false
        if (field.invalid) form.invalid = true
        if (!field.untouched) form.untouched = false
        if (field.touched) form.touched = true
        if (!field.pristine) form.pristine = false
        if (field.dirty) form.dirty = true
        if (!field.unchanged) form.unchanged = false
        if (field.changed) form.changed = true
    })
}

function updateFieldCtrl(validators, form, fieldCtrl, value, files) {
    const {
        initialValue,
        props
    } = fieldCtrl

    const errors = validate(validators, form, props, value, files) || []

    fieldCtrl.value = value;
    fieldCtrl.errors = errors;
    fieldCtrl.unchanged = value === initialValue;
    fieldCtrl.changed = value !== initialValue;
    fieldCtrl.valid = errors.length === 0;
    fieldCtrl.invalid = errors.length > 0;
}

function updateFieldCtrl(validators, form, fieldCtrl, value, files) {
    const {
        initialValue,
        props
    } = fieldCtrl

    const errors = validate(validators, form, props, value, files) || []

    fieldCtrl.value = value;
    fieldCtrl.errors = errors;
    fieldCtrl.unchanged = value === initialValue;
    fieldCtrl.changed = value !== initialValue;
    fieldCtrl.valid = errors.length === 0;
    fieldCtrl.invalid = errors.length > 0;
}