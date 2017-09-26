import React from 'react'

import PropTypes from 'prop-types'

const REACT_FORMCTRL_NAME = 'react-formctl'

const INTEGER_REGEX = /^-?\d+?$/
const FLOAT_REGEX = /^-?\d+(\.\d+)?$/
const EMAIL_REGEX = /\S+@\S+\.\S+/

const PROVIDER_FLAG = `${REACT_FORMCTRL_NAME}.FormProvider`

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
        FORM_SUBMITED: `${REACT_FORMCTRL_NAME}.formSubmited`,
        FORM_RESETED: `${REACT_FORMCTRL_NAME}.formReseted`,
    }
}

export class FormEventDispatcher {

    static copy(payload) {
        return JSON.parse(JSON.stringify(payload))
    }

    static dispatchRegisterForm(form) {
        const payload = FormEventDispatcher.copy({detail: {form}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.REGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchUnregisterForm(form) {
        const payload = FormEventDispatcher.copy({detail: {form}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchSubmitForm(form, formRef) {
        const payload = FormEventDispatcher.copy({detail: {form, formRef}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FORM_SUBMITED, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchResetForm(form) {
        const payload = FormEventDispatcher.copy({detail: {form}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FORM_RESETED, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterField(form, field, fieldCtrl) {
        const payload = FormEventDispatcher.copy({detail: {form, field, fieldCtrl}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.REGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchUnregisterField(form, field) {
        const payload = FormEventDispatcher.copy({detail: {form, field}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldPropsChanged(form, field, props) {
        const payload = FormEventDispatcher.copy({detail: {form, field, props}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FIELD_PROPS_CHANGED, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldChanged(form, field, value) {
        const payload = FormEventDispatcher.copy({detail: {form, field, value}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FIELD_CHANGED, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldBlur(form, field) {
        const payload = FormEventDispatcher.copy({detail: {form, field}})
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FIELD_BLURRED, payload)
        document.dispatchEvent(event)
    }

    static forwardSubmitFormEvent(form, values, formCtrl, formRef) {
        const payload = FormEventDispatcher.copy({detail: {values, formCtrl, formRef}})
        const event = new CustomEvent(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${form}`, payload)
        document.dispatchEvent(event)
    }
    
    static forwardFieldChangedEvent(form, field, fieldCtrl) {
        const payload = FormEventDispatcher.copy({detail: {form, field, fieldCtrl}})
        const event = new CustomEvent(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${field}`, payload)
        document.dispatchEvent(event)
    }
    
    static forwardFormChangedEvent(form, formCtrl) {
        const payload = FormEventDispatcher.copy({detail: {form, formCtrl}})
        const event = new CustomEvent(`${REACT_FORMCTRL.EVENTS.FORM_CHANGED}#${form}`, payload)
        document.dispatchEvent(event)
    }

}

export class FormProvider extends React.Component {

    static propTypes = {
        customValidators: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            validate: PropTypes.func.isRequired
        }))
    }

    constructor(props) {
        super(props)
        this.state = {
            forms: {},
            customValidators: {}
        }
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.onEvent = this.onEvent.bind(this)
        this.onRegisterForm = this.onRegisterForm.bind(this)
        this.onUnregisterForm = this.onUnregisterForm.bind(this)
        this.onRegisterField = this.onRegisterField.bind(this)
        this.onUnregisterField = this.onUnregisterField.bind(this)
        this.onFieldChanged = this.onFieldChanged.bind(this)
        this.onFieldPropsChanged = this.onFieldPropsChanged.bind(this)
        this.onFieldBlurred = this.onFieldBlurred.bind(this)
        this.onFormSubmited = this.onFormSubmited.bind(this)
        this.onFormReseted = this.onFormReseted.bind(this)
        this.updateFormCtrl = this.updateFormCtrl.bind(this)
        this.updateFieldCtrl = this.updateFieldCtrl.bind(this)
    }

    componentWillMount() {
        // if (window.sessionStorage.getItem(PROVIDER_FLAG)) {
        //     throw 'Two instances of FormProvided found, only one instance can exists because events erros may occur.'
        // }
        // window.sessionStorage.setItem(PROVIDER_FLAG, 'true')
        this.subscribe()
        const newState = {
            customValidators: {},
        }
        const {customValidators = []} = this.props
        customValidators.forEach(validator => {
            newState.customValidators[validator.name] = validator.validate
        })
        this.setState(newState)
    }

    componentWillUnmount() {
        // window.sessionStorage.removeItem(PROVIDER_FLAG)
        this.unsubscribe()
    }

    subscribe() {
        document.addEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FORM, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.FIELD_CHANGED, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.FIELD_BLURRED, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.FIELD_PROPS_CHANGED, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.FORM_SUBMITED, this.onEvent)
        document.addEventListener(REACT_FORMCTRL.EVENTS.FORM_RESETED, this.onEvent)
    }

    onEvent(event) {
        const type = event.type
        const payload = event.detail
        const EVENTS = REACT_FORMCTRL.EVENTS
        switch(type) {
            case EVENTS.REGISTER_FORM:
                this.onRegisterForm(payload.form)
                break
            case EVENTS.UNREGISTER_FORM:
                this.onUnregisterForm(payload.form)
                break
            case EVENTS.REGISTER_FIELD:
                this.onRegisterField(payload.form, payload.field, payload.fieldCtrl)
                break
            case EVENTS.UNREGISTER_FIELD:
                this.onUnregisterField(payload.form, payload.field)
                break
            case EVENTS.FIELD_CHANGED:
                this.onFieldChanged(payload.form, payload.field, payload.value)
                break
            case EVENTS.FIELD_PROPS_CHANGED:
                this.onFieldPropsChanged(payload.form, payload.field, payload.props)
                break
            case EVENTS.FIELD_BLURRED:
                this.onFieldBlurred(payload.form, payload.field)
                break
            case EVENTS.FORM_SUBMITED:
                this.onFormSubmited(payload.form, payload.formRef)
                break
            case EVENTS.FORM_RESETED:
                this.onFormReseted(payload.form)
                break
            default:
                break
        }
    }

    onRegisterForm(formName) {
        this.setState((state) => {
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
                    values: {}
                }
            }
            return {forms}
        })
    }

    onRegisterField(formName, fieldName, fieldCtrl) {
        this.setState((state) => {
            if(state.forms[formName]) {
                const forms = {...state.forms}
                const form = forms[formName]
                if(form.fields[fieldName]) {
                    fieldCtrl.__instances = form.fields[fieldName].__instances + 1
                } else {
                    fieldCtrl.__instances = 1
                }
                this.updateFieldCtrl(formName, fieldCtrl, fieldCtrl.initialValue)
                FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, fieldCtrl)

                form.fields[fieldName] = fieldCtrl
                form.values[fieldName] = fieldCtrl.value
                this.updateFormCtrl(formName, form)
                return {forms}
            } else {
                console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
            }
            return state
        })
    }

    onUnregisterForm(formName) {
        this.setState((state) => {
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
        })
    }

    onUnregisterField(formName, fieldName) {
        this.setState((state) => {
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
        })
    }

    onFieldChanged(formName, fieldName, value) {
        this.setState((state) => {
            if(state.forms[formName]) {
                if(state.forms[formName].fields[fieldName]) {
                    const forms = {...state.forms}
                    const form = forms[formName]
                    const fieldCtrl = form.fields[fieldName]
                    fieldCtrl.dirty = true
                    fieldCtrl.pristine = false
                    this.updateFieldCtrl(formName, fieldCtrl, value)
                    FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, fieldCtrl)
                    if(!form.values) form.values = {}
                    form.values[fieldName] = value
                    this.updateFormCtrl(formName, form)
                    return {forms}
                }
            }
            return state
        })
    }

    onFieldPropsChanged(formName, fieldName, props) {
        this.setState(state => {
            const forms = {...state.forms}
            const form = forms[formName]
            const field = form.fields[fieldName]
            field.props = props
            this.updateFieldCtrl(formName, field, field.value)
            FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, field)
            this.updateFormCtrl(formName, form)
            return {forms}
        })
    }

    onFieldBlurred(formName, fieldName) {
        this.setState(state => {
            const forms = {...state.forms}
            const form = forms[formName]
            const field = form.fields[fieldName]
            field.touched = true
            field.untouched = false
            FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, field)
            this.updateFormCtrl(formName, form)
            return {forms}
        })
    }
    
    updateFormCtrl(formName, form) {
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
        FormEventDispatcher.forwardFormChangedEvent(formName, form)
    }

    createValidationError(key, params) {
        return {
            key,
            params
        }
    }

    updateFieldCtrl(formName, fieldCtrl, value) {
        const errors = []
        const {customValidators = {}} = this.state
        const {
            initialValue,
            props: {
                name,
                type = 'text', 
                required, 
                pattern, 
                match, 
                integer,
                min,
                max,
                minLength,
                maxLength,
                validate = []
            }
        } = fieldCtrl

        if(required && !value) errors.push(this.createValidationError('required'))
        else if(pattern && pattern instanceof RegExp && !pattern.test(value)) errors.push(this.createValidationError('pattern', {value, pattern}))
        else if(pattern && !new RegExp(pattern).test(value)) errors.push(this.createValidationError('pattern', {value, pattern}))
        else if(match) {
            const form = this.state.forms[formName]
            if(form && form.values[match] != value) errors.push(this.createValidationError('match', {value, match}))
        } else {
            if(type === 'email' && !EMAIL_REGEX.test(value)) errors.push(this.createValidationError('email', {value}))
            if(type === 'number') {
                if(integer && !INTEGER_REGEX.test(value)) errors.push(this.createValidationError('integer', {value}))
                if(!integer && !FLOAT_REGEX.test(value)) errors.push(this.createValidationError('float', {value}))
                if(min && +value < min) errors.push(this.createValidationError('min', {value, min}))
                if(max && +value > max) errors.push(this.createValidationError('max', {value, max}))
            } else {
                if(minLength && value && value.length < minLength) errors.push(this.createValidationError('minLength', {value, minLength}))
                if(maxLength && value && value.length > maxLength) errors.push(this.createValidationError('maxLength', {value, maxLength}))
            }
            if(validate.length && Object.keys(customValidators).length) {
                validate.forEach(validatorSpec => {
                    let validatorName = validatorSpec
                    const params = {value, ...validatorSpec.params}
                    if(typeof validatorSpec === 'object') {
                        validatorName = validatorSpec.name
                    }
                    let validator = customValidators[validatorName]
                    if(validator && !validator(value, params)) errors.push(this.createValidationError(validatorName, params))
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

    onFormSubmited(formName, formRef) {
        this.setState((state) => {
            const form = state.forms[formName]
            if(form) {
                FormEventDispatcher.forwardSubmitFormEvent(formName, form.values, form, formRef)
            }
            return state
        })
    }

    onFormReseted(formName) {
        this.setState(state => {
            const forms = {...state.forms}
            const form = forms[formName]
            Object.keys(form.fields).forEach(fieldName => {
                const field = form.fields[fieldName]
                this.updateFieldCtrl(formName, field, field.initialValue)
                field.touched = false
                field.untouched = true
                field.dirty = false
                field.pristine = true
                FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, field)
                form.values[fieldName] = field.initialValue
            })
            this.updateFormCtrl(formName, form)
            return state
        })
    }

    unsubscribe() {
        document.removeEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FIELD_CHANGED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FIELD_BLURRED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FIELD_PROPS_CHANGED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FORM_SUBMITED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FORM_RESETED, this.onEvent)
    }

    render() {
        const {children} = this.props
        return children;
    }

}