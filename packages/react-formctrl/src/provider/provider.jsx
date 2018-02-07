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

import { copyFieldCtrl, copyFormCtrl, dispatchEvent } from './provider.utils'

import { formProviderReducer } from './provider.reducer'
import { formProviderEffects } from './provider.effects'

const PROVIDER_EVENT = `${REACT_FORMCTRL_NAME}.FormProvider`

export class FormEventDispatcher {

    static dispatchRegisterForm(form) {
        const payload = onRegisterForm(form)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchUnregisterForm(form) {
        const payload = onUnregisterForm(form)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchSubmitForm(form, formRef) {
        const payload = onSubmitForm(form, formRef)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchResetForm(form, formRef, eventType) {
        const payload = onResetForm(form, formRef, eventType)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchRegisterField(form, field, fieldCtrl) {
        const payload = onRegisterField(form, field, fieldCtrl)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchUnregisterField(form, field) {
        const payload = onUnregisterField(form, field)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchFieldPropsChanged(form, field, props) {
        const payload = onFieldPropsChanged(form, field, props)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchFieldChanged(form, field, value, files, eventType) {
        const payload = onFieldChanged(form, field, value, files, eventType)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchFieldBlur(form, field, eventType) {
        const payload = onFieldBlur(form, field, eventType)
        dispatchEvent(PROVIDER_EVENT, payload)
    }

    static dispatchRegisterValidators(validators) {
        const payload = onRegisterValidators(validators)
        dispatchEvent(PROVIDER_EVENT, payload)
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
        const { validators = [] } = this.props
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
        const { children } = this.props
        return children;
    }

}