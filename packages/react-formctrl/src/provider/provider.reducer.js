
import {REACT_FORMCTRL} from './provider.actions'

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
            return onFormSubmited(state, payload.form, payload.formRef)
        case EVENTS.FORM_RESETED:
            return onFormReseted(state, payload.form)
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
            validating: false,
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
        form.values[fieldName] = fieldCtrl.value
        updateFormCtrl(formName, form)
        return {forms}
    } else {
        console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
    }
    return state
}

function onUnregisterForm(state, formName) {
    if(state.forms[formName]) {
        const forms = {...state.forms}
        const form = forms[formName]
        if(form.__instances > 1) {
            form.__instances--
        } else {
            delete forms[formName]
        }
        return {forms}
    }
    return state
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
            if(!form.values) form.values = {}
            form.values[fieldName] = value
            if(!form.files) form.files = {}
            if(files) {
                form.files[fieldName] = files
            } else if(form.files[fieldName]) {
                delete form.files[fieldName]
            }
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

function onFormSubmited(state, formName, formRef) {
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
        form.values[fieldName] = field.initialValue
    })
    updateFormCtrl(formName, form)
    return {forms}
}

function createValidationError(key, params) {
    return {
        key,
        params
    }
}

function updateFormCtrl(formName, form) {
    form.validating = false
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
        if(field.validating) form.validating = true
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
    const errors = []
    const {customValidators = {}} = state
    const {
        initialValue,
        props: {
            name = null,
            type = 'text', 
            required = null, 
            pattern = null, 
            match = null, 
            integer = null,
            min = null,
            max = null,
            minLength = null,
            maxLength = null,
            extensions = [],
            accept = null, 
            maxSize = null,
            validate = []
        }
    } = fieldCtrl

    if(required && !value) errors.push(createValidationError('required'))
    else if(pattern != null && pattern instanceof RegExp && !pattern.test(value)) errors.push(createValidationError('pattern', {value, pattern}))
    else if(pattern  != null && !new RegExp(pattern).test(value)) errors.push(createValidationError('pattern', {value, pattern}))
    else if(match != null) {
        const form = state.forms[formName]
        if(form && form.values[match] != value) errors.push(createValidationError('match', {value, match}))
    } else {
        if(type === 'email' && !EMAIL_REGEX.test(value)) errors.push(createValidationError('email', {value}))
        if(type === 'number') {
            if(integer && !INTEGER_REGEX.test(value)) errors.push(createValidationError('integer', {value}))
            if(!integer && !FLOAT_REGEX.test(value)) errors.push(createValidationError('float', {value}))
            if(min != null && +value < min) errors.push(createValidationError('min', {value, min}))
            if(max != null && +value > max) errors.push(createValidationError('max', {value, max}))
        } else if(type === 'file' && files && files.length) {
            files.forEach(file => {
                if(extensions && extensions.length) {
                    const matchedExtensions = extensions.filter(extension => {
                        const regex = new RegExp(`\\.${extension.replace(/\./, '')}$`, 'i')
                        return regex.test(file.name)
                    })
                    if(!matchedExtensions.length) errors.push(createValidationError('extension', {value, file, extensions}))
                } else if(accept) {
                    const matchedAccepts = accept.replace(/ /g, '').split(',').filter(mimetype => new RegExp(`^${mimetype.replace(/\*/g, '.*')}$`).test(file.type))
                    if(!matchedAccepts.length) errors.push(createValidationError('accept', {value, file, accept}))
                }
                if(maxSize != null && file.size > +maxSize) errors.push(createValidationError('maxSize', {value, file, maxSize}))
            })
        } else {
            if(minLength != null && value && value.length < minLength) errors.push(createValidationError('minLength', {value, minLength}))
            if(maxLength != null && value && value.length > maxLength) errors.push(createValidationError('maxLength', {value, maxLength}))
        }
        if(validate.length && Object.keys(customValidators).length) {
            validate.forEach(validatorSpec => {
                let validatorName = validatorSpec
                const params = {value, ...validatorSpec.params}
                if(typeof validatorSpec === 'object') {
                    validatorName = validatorSpec.name
                }
                let validator = customValidators[validatorName]
                if(validator && !validator(value, params, files)) errors.push(createValidationError(validatorName, params))
            })
        }
    }

    fieldCtrl.value = value;
    fieldCtrl.errors = errors;
    fieldCtrl.unchanged = value === initialValue;
    fieldCtrl.changed = value !== initialValue;
    fieldCtrl.valid = errors.length === 0;
    fieldCtrl.invalid = errors.length > 0;
}

