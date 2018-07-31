
import {REACT_FORMCTRL} from './provider.actions'
import {validate, combineValidators} from '../validator'

const INTEGER_REGEX = /^-?\d+?$/
const FLOAT_REGEX = /^-?\d+(\.\d+)?$/
const EMAIL_REGEX = /\S+@\S+\.\S+/

export function formProviderReducer(state = {forms: {}}, action) {
    const type = action.type
    const payload = action.payload
    const EVENTS = REACT_FORMCTRL.EVENTS
    switch(type) {
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
            return onFormSubmited(state, payload.form)
        case EVENTS.FORM_RESETED:
            return onFormReseted(state, payload.form)
        case EVENTS.REGISTER_VALIDATORS:
            return {...state, validators: combineValidators(payload.validators)}
        default:
            return state
    }
}

function onRegisterForm(state, formName) {
    const forms = {...state.forms}
    if(forms[formName]) {
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
            values: {},
            files: {}
        }
    }
    return {forms}
}

function onRegisterField(state, formName, fieldName, fieldCtrl) {
    if(state.forms[formName]) {
        const forms = {...state.forms}
        const form = forms[formName]
        if(form.fields[fieldName]) {
            fieldCtrl.__instances = form.fields[fieldName].__instances + 1
        } else {
            fieldCtrl.__instances = 1
        }
        updateFieldCtrl(state, formName, fieldCtrl, fieldCtrl.initialValue)
        form.fields[fieldName] = fieldCtrl
        if(fieldCtrl.value && fieldCtrl.props.type === 'date' || fieldCtrl.props.type === 'datetime-local') {
            form.values[fieldName] = new Date(fieldCtrl.value)
        } else {
            form.values[fieldName] = fieldCtrl.value
        }

        updateFormCtrl(formName, form)
        return {forms}
    } else {
        console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
    }
    return state
}

function onUnregisterForm(state, formName) {
    const forms = {...state.forms}
    const form = forms[formName]
    if(form.__instances > 1) {
        form.__instances--
    } else {
        delete forms[formName]
    }
    return {forms}
}

function onUnregisterField(state, formName, fieldName) {
    if(state.forms[formName]) {
        if(state.forms[formName].fields[fieldName]) {
            const forms = {...state.forms}
            const form = forms[formName]
            const field = form.fields[fieldName]
            if(field.__instances > 1) {
                field.__instances--
            } else {
                delete form.fields[fieldName]
            }
            return {forms}
        }
    }
    return state
}

function onFieldChanged(state, formName, fieldName, value, files) {
    if(state.forms[formName]) {
        if(state.forms[formName].fields[fieldName]) {
            const forms = {...state.forms}
            const form = forms[formName]
            const fieldCtrl = form.fields[fieldName]
            fieldCtrl.dirty = true
            fieldCtrl.pristine = false
            updateFieldCtrl(state, formName, fieldCtrl, value, files)
            if(value && fieldCtrl.props.type === 'date' || fieldCtrl.props.type === 'datetime-local') {
                form.values[fieldName] = new Date(value)
            } else {
                form.values[fieldName] = value
            }
            form.files[fieldName] = files
            updateFormCtrl(formName, form)
            return {forms}
        }
    }
    return state
}

function onFieldPropsChanged(state, formName, fieldName, props) {
    const forms = {...state.forms}
    const form = forms[formName]
    const field = form.fields[fieldName]
    field.props = props
    updateFieldCtrl(state, formName, field, field.value)
    updateFormCtrl(formName, form)
    return {forms}
}

function onFieldBlurred(state, formName, fieldName) {
    const forms = {...state.forms}
    const form = forms[formName]
    const field = form.fields[fieldName]
    field.touched = true
    field.untouched = false
    updateFormCtrl(formName, form)
    return {forms}
}

function onFormSubmited(state, formName) {
    return state
}

function onFormReseted(state, formName) {
    const forms = {...state.forms}
    const form = forms[formName]
    Object.keys(form.fields).forEach(fieldName => {
        const field = form.fields[fieldName]
        updateFieldCtrl(state, formName, field, field.initialValue)
        field.touched = false
        field.untouched = true
        field.dirty = false
        field.pristine = true
        if(field.initialValue && field.props.type === 'date' || field.props.type === 'datetime-local') {
            form.values[fieldName] = new Date(field.initialValue)
        } else {
            form.values[fieldName] = field.initialValue
        }
    })
    updateFormCtrl(formName, form)
    return {forms}
}

function updateFormCtrl(formName, form) {
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
        if(!field.valid) form.valid = false
        if(field.invalid) form.invalid = true
        if(!field.untouched) form.untouched = false
        if(field.touched) form.touched = true
        if(!field.pristine) form.pristine = false
        if(field.dirty) form.dirty = true
        if(!field.unchanged) form.unchanged = false
        if(field.changed) form.changed = true
    })
}

function updateFieldCtrl(state, formName, fieldCtrl, value, files) {
    const {
        initialValue,
        props
    } = fieldCtrl

    const errors = validate(state.validators, state.forms[formName], props, value, files) || []

    fieldCtrl.value = value;
    fieldCtrl.errors = errors;
    fieldCtrl.unchanged = value === initialValue;
    fieldCtrl.changed = value !== initialValue;
    fieldCtrl.valid = errors.length === 0;
    fieldCtrl.invalid = errors.length > 0;
}

