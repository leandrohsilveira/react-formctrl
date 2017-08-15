import React from 'react'

const REACT_FORMCTRL_NAME = 'react-formctl'

const PROVIDER_FLAG = `${REACT_FORMCTRL_NAME}.FormProvider`

export const REACT_FORMCTRL = {
    EVENTS: {
        REGISTER_FORM: `${REACT_FORMCTRL_NAME}.registerForm`,
        UNREGISTER_FORM: `${REACT_FORMCTRL_NAME}.unregisterForm`,
        REGISTER_FIELD: `${REACT_FORMCTRL_NAME}.registerField`,
        UNREGISTER_FIELD: `${REACT_FORMCTRL_NAME}.unregisterField`,
        FIELD_CHANGED: `${REACT_FORMCTRL_NAME}.fieldChanged`,
        FORM_SUBMITED: `${REACT_FORMCTRL_NAME}.formSubmited`,
        FORM_RESETED: `${REACT_FORMCTRL_NAME}.formReseted`,
    }
}

export class FormEventDispatcher {
    static dispatchRegisterForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.REGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchUnregisterForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchSubmitForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FORM_SUBMITED, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchResetForm(form) {
        const payload = {detail: {form}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FORM_RESETED, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterField(form, field, fieldCtrl) {
        const payload = {detail: {form, field, fieldCtrl}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.REGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchUnregisterField(form, field) {
        const payload = {detail: {form, field}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldChanged(form, field, fieldCtrl) {
        const payload = {detail: {form, field, fieldCtrl}}
        const event = new CustomEvent(REACT_FORMCTRL.EVENTS.FIELD_CHANGED, payload)
        document.dispatchEvent(event)
    }

    static forwardSubmitFormEvent(form, values, formCtrl) {
        const payload = {detail: {values, formCtrl}}
        const event = new CustomEvent(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${form}`, payload)
        document.dispatchEvent(event)
    }

    static forwardFieldChangedEvent(form, field, fieldCtrl) {
        const payload = {detail: {form, field, fieldCtrl}}
        const event = new CustomEvent(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${field}`, payload)
        document.dispatchEvent(event)
    }

    static forwardFormValues(form, fields) {
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName]
            FormEventDispatcher.forwardFieldChangedEvent(form, fieldName, field)
        })
    }

}

export class FormProvider extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            forms: {}
        }
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
        // if (window.sessionStorage.getItem(PROVIDER_FLAG)) {
        //     throw 'Two instances of FormProvided found, only one instance can exists because events erros may occur.'
        // }
        // window.sessionStorage.setItem(PROVIDER_FLAG, 'true')
        this.subscribe()
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

    onRegisterForm(formName) {
        this.setState((state) => {
            const forms = {...state.forms}
            if(forms[formName]) {
                const form = forms[formName]
                form.__instances++
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
                form.fields[fieldName] = fieldCtrl
                const field = form.fields[fieldName]
                if(field.__instances) {
                    field.__instances++
                } else {
                    field.__instances = 1
                }
                FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, field)
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

    onFieldChanged(formName, fieldName, fieldCtrl) {
        this.setState((state) => {
            if(state.forms[formName]) {
                if(state.forms[formName].fields[fieldName]) {
                    const forms = {...state.forms}
                    const form = forms[formName]
                    if(!form.values) form.values = {}
                    form.values[fieldName] = fieldCtrl.value
                    form.fields[fieldName] = {...fieldCtrl}
                    this.updateFormCtrl(form)
                    FormEventDispatcher.forwardFieldChangedEvent(formName, fieldName, form.fields[fieldName])
                    return {forms}
                }
            }
            return state
        })
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
            if(!field.unchanged) form.unchanged = false
            if(field.changed) form.changed = true
        })
    }

    onFormSubmited(formName) {
        this.setState((state) => {
            const form = state.forms[formName]
            if(form) {
                FormEventDispatcher.forwardSubmitFormEvent(formName, form.values, form)
            }
            return state
        })
    }

    onFormReseted(formName) {
        this.setState((state) => {
            if(state.forms[formName]) {
                const forms = {...state.forms}
                const form = forms[formName]
                Object.keys(form.fields).forEach(fieldName => {
                    const field = form.fields[fieldName]
                    form.values[fieldName] = field.initialValue
                    field.value = field.initialValue
                })
                FormEventDispatcher.forwardFormValues(formName, form.fields)
                return {forms}
            }
            return state
        })
    }

    unsubscribe() {
        document.removeEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FIELD_CHANGED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FORM_SUBMITED, this.onEvent)
        document.removeEventListener(REACT_FORMCTRL.EVENTS.FORM_RESETED, this.onEvent)
    }

    render() {
        const {children} = this.props
        return children;
    }

}