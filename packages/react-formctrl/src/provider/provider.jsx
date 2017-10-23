import React from 'react'

import PropTypes from 'prop-types'

import {
    onRegisterForm,
    onRegisterField,
    onUnregisterForm,
    onUnregisterField,
    onFieldChanged,
    onFieldPropsChanged,
    onFieldBlur,
    onSubmitForm,
    onResetForm,
    onRegisterValidators,
    REACT_FORMCTRL_NAME
} from './provider.actions'

import {copyFieldCtrl, copyFormCtrl} from './provider.utils'

import {formProviderReducer} from './provider.reducer'
import {formProviderEffects} from './provider.effects'

const PROVIDER_EVENT = `${REACT_FORMCTRL_NAME}.FormProvider`

export class FormEventDispatcher {

    static dispatchRegisterForm(form) {
        const payload = {detail: onRegisterForm(form)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchUnregisterForm(form) {
        const payload = {detail: onUnregisterForm(form)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchSubmitForm(form, formRef) {
        const payload = {detail: onSubmitForm(form, formRef)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }
    
    static dispatchResetForm(form) {
        const payload = {detail: onResetForm(form)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterField(form, field, fieldCtrl) {
        const payload = {detail: onRegisterField(form, field, fieldCtrl)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchUnregisterField(form, field) {
        const payload = {detail: onUnregisterField(form, field)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldPropsChanged(form, field, props) {
        const payload = {detail: onFieldPropsChanged(form, field, props)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldChanged(form, field, value, files) {
        const payload = {detail: onFieldChanged(form, field, value, files)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchFieldBlur(form, field) {
        const payload = {detail: onFieldBlur(form, field)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterValidators(validators) {
        const payload = {detail: onRegisterValidators(validators)}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
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
            validators: {}
        }
        this.onEvent = this.onEvent.bind(this)
    }

    componentWillMount() {
        document.addEventListener(PROVIDER_EVENT, this.onEvent)
        const {validators = []} = this.props
        FormEventDispatcher.dispatchRegisterValidators(validators)
    }

    componentWillUnmount() {
        document.removeEventListener(PROVIDER_EVENT, this.onEvent)
    }

    onEvent(event) {
        const action = event.detail
        this.setState(state => {
            const newState = formProviderReducer(state, action)
            formProviderEffects(newState, action)
            return newState
        })
    }

    render() {
        const {children} = this.props
        return children;
    }

}