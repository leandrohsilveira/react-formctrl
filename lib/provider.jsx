import React from 'react'

const PROVIDER_FLAG = 'react-formctl.FormProvider'

export const REACT_FORMCTL = {
    EVENTS: {
        PREFIX: 'react-formctl',
        REGISTER_FORM: `${REACT_FORMCTL.EVENTS.PREFIX}.registerForm`,
        UNREGISTER_FORM: `${REACT_FORMCTL.EVENTS.PREFIX}.unregisterForm`,
        REGISTER_FIELD: `${REACT_FORMCTL.EVENTS.PREFIX}.registerField`,
        UNREGISTER_FIELD: `${REACT_FORMCTL.EVENTS.PREFIX}.unregisterField`,
        FIELD_CHANGED: `${REACT_FORMCTL.EVENTS.PREFIX}.fieldChanged`,
        FORM_SUBMITED: `${REACT_FORMCTL.EVENTS.PREFIX}.formSubmited`,
        FORM_RESETED: `${REACT_FORMCTL.EVENTS.PREFIX}.formReseted`,
    }
}

export class FormEventDispatcher {
    static dispatchRegisterForm(form, initialValues) {
        const payload = {detail: {form, initialValues}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.REGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchUnregisterForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.UNREGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchSubmitForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.FORM_SUBMITED, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchResetForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.FORM_RESETED, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterField(form, field) {
        const payload = {detail: {form, field}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.REGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchUnregisterField(form, field) {
        const payload = {detail: {form, field}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.UNREGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldChanged(form, field, fieldCtrl) {
        const payload = {detail: {form, field, fieldCtrl}}
        const event = new CustomEvent(REACT_FORMCTL.EVENTS.FIELD_CHANGED, payload)
        document.dispatchEvent(event)
    }

    static forwardSubmitFormEvent(form, values, formCtrl) {
        const payload = {detail: {values, formCtrl}}
        const event = new CustomEvent(`${REACT_FORMCTL.EVENTS.FORM_SUBMITED}#${form}`, payload)
        document.dispatchEvent(event)
    }

    static forwardFieldChanged(form, field, fieldCtrl) {
        const payload = {detail: {form, field, fieldCtrl}}
        const event = new CustomEvent(`${REACT_FORMCTL.EVENTS.FORM_SUBMITED}#${form}#${field}`, payload)
        document.dispatchEvent(event)
    }

    static forwardFormValues(form, fields) {
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName]
            FormEventDispatcher.forwardFieldChanged(form, fieldName, field)
        })
    }

}

export class FormProvider extends React.Component {

    constructor(props) {
        super(props)
        this.state.forms = {}
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.onEvent = this.onEvent.bind(this)
        this.onRegisterForm = this.onRegisterForm.bind(this)
        this.onUnregisterForm = this.onUnregisterForm.bind(this)
        this.onRegisterField = this.onRegisterField.bind(this)
        this.onUnregisterField = this.onUnregisterField.bind(this)
        this.onFieldChanged = this.onFieldChanged.bind(this)
        this.onFormSubmited = this.onFormSubmited.bind(this)
        this.onFormReseted = this.onFormReseted.bind(this)
        this.updateFormCtrl = this.updateFormCtrl.bind(this)
    }

    componentWillMount() {
        if (window.sessionStorage.getItem(PROVIDER_FLAG)) {
            throw 'Two instances of FormProvided found, only one instance can exists because events erros may occur.'
        }
        window.sessionStorage.setItem(PROVIDER_FLAG, 'true')
        subscribe()
    }

    componentWillUnmount() {
        window.sessionStorage.removeItem(PROVIDER_FLAG)
        unsubscribe()
    }

    subscribe() {
        document.addEventListener(REACT_FORMCTL.EVENTS.REGISTER_FORM, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.FIELD_CHANGED, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.FORM_SUBMITED, this.onEvent)
        document.addEventListener(REACT_FORMCTL.EVENTS.FORM_RESETED, this.onEvent)
    }

    onEvent(event) {
        const type = event.type
        const payload = event.detail
        const EVENTS = REACT_FORMCTL.EVENTS
        switch(type) {
            case EVENTS.REGISTER_FORM:
                this.onRegisterForm(payload.form, payload.initialValues)
                break
            case EVENTS.UNREGISTER_FORM:
                this.onUnregisterForm(payload.form)
                break
            case EVENTS.REGISTER_FIELD:
                this.onRegisterField(payload.form, payload.field)
                break
            case EVENTS.UNREGISTER_FIELD:
                this.onUnregisterField(payload.form, payload.field)
                break
            case EVENTS.FIELD_CHANGED:
                this.onFieldChanged(payload.form, payload.field, payload.fieldCtrl)
                break
            case EVENTS.FORM_SUBMITED:
                this.onFormSubmited(payload.form)
                break
            case EVENTS.FORM_RESETED:
                this.onFormReseted(payload.form)
                break
            default:
                break
        }
    }

    onRegisterForm(formName, initialValues) {
        const forms = {...this.state.forms}
        if(forms[formName]) {
            const form = forms[formName]
            form.__instances++
            if(initialValues) {
                console.warn(`One or more instances of the same form found while registering the form "${form}" with initial values: `, initialValues)
                form.values = initialValues
                form.initialValues = initialValues
            }
        } else {
            forms[formName] = {
                __instances: 1,
                valid: true,
                invalid: false,
                untouched: true,
                touched: false,
                pristine: true,
                dirty: false,
                unchanged: true,
                changed: false,
                values: initialValues,
                initialValues
            }
        }
        this.setState({forms})
    }

    onRegisterField(formName, fieldName) {
        if(this.state.forms[formName]) {
            const forms = {...this.state.forms}
            const form = forms[formName]
            if(form.fields[fieldName]) {
                form.fields[fieldName].__instances++
            } else {
                form.fields[fieldName] = {
                    __instances: 1,
                    valid: true,
                    invalid: false,
                    untouched: true,
                    touched: false,
                    pristine: true,
                    dirty: false,
                    unchanged: true,
                    changed: false,
                    value: form.values && form.values[fieldName]
                }
            }
            const fieldValue = form.fields[fieldName].value
            if(fieldValue) {
                FormEventDispatcher.forwardFieldChanged(formName, fieldName, fieldValue)
            }
            this.setState({forms})
        } else {
            console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
        }
    }

    onUnregisterForm(formName) {
        if(this.state.forms[formName]) {
            const forms = {...this.state.forms}
            const form = forms[formName]
            if(form.__instances > 1) {
                form.__instances--
            } else {
                delete forms[formName]
            }
        }
    }

    onUnregisterField(formName, fieldName) {
        if(this.state.forms[formName]) {
            if(this.state.forms[formName].fields[fieldName]) {
                const forms = {...this.state.forms}
                const form = forms[formName]
                const field = form.fields[fieldName]
                if(field.__instances > 1) {
                    field.__instances--
                } else {
                    delete form.fields[fieldName]
                }
                this.setState({forms})
            }
        }
    }

    onFieldChanged(formName, fieldName, fieldCtrl) {
        if(this.state.forms[formName]) {
            if(this.state.forms[formName].fields[fieldName]) {
                const forms = {...this.state.forms}
                const form = forms[formName]
                if(!form.values) form.values = {}
                form.values[fieldName] = fieldCtrl.value
                form.fields[fieldName] = {...fieldCtrl}
                this.updateFormCtrl(form)
                FormEventDispatcher.forwardFieldChanged(formName, fieldName, form.fields[fieldName])
                this.setState({forms})
            }
        }
    }

    updateFormCtrl(form) {
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
            const initialValue = form.initialValues[fieldName]
            field.unchanged = field.value === initialValue 
            field.changed = field.value !== initialValue
            if(!field.unchanged) form.unchanged = false
            if(field.changed) form.changed = true
        })
    }

    onFormSubmited(formName) {
        const form = this.state.forms[formName]
        if(form) {
            FormEventDispatcher.forwardSubmitFormEvent(formName, form.values, form)
        }
    }

    onFormReseted(formName) {
        if(this.state.forms[formName]) {
            const forms = {...this.state.forms}
            const form = forms[formName]
            form.values = form.initialValues
            Object.keys(form.fields).forEach(fieldName => {
                const field = form.fields[fieldName]
                field.value = form.initialValues && form.initialValues[fieldName]
            })
            FormEventDispatcher.forwardFormValues(formName, form.fields)
            this.setState({forms})
        }
    }

    unsubscribe() {
        document.removeEventListener(REACT_FORMCTL.EVENTS.REGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.FIELD_CHANGED, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.FORM_SUBMITED, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.FORM_RESETED, this.onEvent)
    }

    render() {
        const {children} = this.props
        return children;
    }

}