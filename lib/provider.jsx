import React from 'react'

const PROVIDER_FLAG = 'react-formctl.FormProvider'

export const REACT_FORMCTL = {
    EVENTS: {
        PREFIX: 'react-formctl',
        REGISTER_FORM: `${REACT_FORMCTL.EVENTS.PREFIX}.registerForm`,
        REGISTER_FIELD: `${REACT_FORMCTL.EVENTS.PREFIX}.registerField`,
        UNREGISTER_FORM: `${REACT_FORMCTL.EVENTS.PREFIX}.unregisterForm`,
        UNREGISTER_FIELD: `${REACT_FORMCTL.EVENTS.PREFIX}.unregisterField`,
        FIELD_CHANGED: `${REACT_FORMCTL.EVENTS.PREFIX}.fieldChanged`,
    }
}

export class FormEventDispatcher {
    static dispatchRegisterForm(form, initialValues) {
        document.dispatchEvent(new CustomEvent(REACT_FORMCTL.EVENTS.REGISTER_FORM, {detail: {form, initialValues}}))
    }

    static dispatchUnregisterForm(form) {
        document.dispatchEvent(new CustomEvent(REACT_FORMCTL.EVENTS.UNREGISTER_FORM, {detail: {form}}))
    }

    static dispatchRegisterField(form, field) {
        document.dispatchEvent(new CustomEvent(REACT_FORMCTL.EVENTS.REGISTER_FIELD, {detail: {form, field}}))
    }

    static dispatchUnregisterField(form, field) {
        document.dispatchEvent(new CustomEvent(REACT_FORMCTL.EVENTS.UNREGISTER_FIELD, {detail: {form, field}}))
    }

    static dispatchFieldChanged(form, field, ctrl) {
        document.dispatchEvent(new CustomEvent(REACT_FORMCTL.EVENTS.FIELD_CHANGED, {detail: {form, field, ctrl}}))
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
                this.onFieldChanged(payload.form, payload.field, payload.ctrl)
                break
            default:
                break
        }
    }

    registerForm(formName, initialValues) {
        const forms = {...this.state.forms}
        if(forms[formName]) {
            if(initialValues) {
                console.warn(`One or more instances of the same form found while registering the form "${form}" with initial values: `, initialValues)
                forms[formName].values = initialValues
            }
        } else {
            forms[formName] = {
                valid: true,
                invalid: false,
                untouched: true,
                touched: false,
                pristine: true,
                dirty: false,
                unchanged: true,
                changed: false,
                values: initialValues
            }
        }
        this.setState({forms})
    }

    registerField(formName, fieldName) {
        const forms = {...this.state.forms}
        const form = forms[formName]
        if(form) {
            if(!form.fields[fieldName]) {
                form.fields[fieldName] = {
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

        } else {
            console.warn(`No form instance with name "${formName}" to register field "${fieldName}".`)
        }
    }

    unsubscribe() {
        document.removeEventListener(REACT_FORMCTL.EVENTS.REGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.REGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FORM, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.UNREGISTER_FIELD, this.onEvent)
        document.removeEventListener(REACT_FORMCTL.EVENTS.FIELD_CHANGED, this.onEvent)
    }

    render() {
        const {props} = this
    }

}