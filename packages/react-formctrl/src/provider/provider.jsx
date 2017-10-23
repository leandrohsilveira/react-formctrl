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
    onFieldArrayEntryPush,
    onFieldArrayEntryRemove,
    onRegisterFieldArray,
    onUnregisterFieldArray,
    REACT_FORMCTRL_NAME
} from './provider.actions'

import {copyFieldCtrl, copyFormCtrl} from './provider.utils'

import {formProviderReducer} from './provider.reducer'
import {formProviderEffects} from './provider.effects'

const PROVIDER_EVENT = `${REACT_FORMCTRL_NAME}.FormProvider`

export class FormEventDispatcher {

    static dispatchProviderEvent(detail) {
        const payload = {detail}
        const event = new CustomEvent(PROVIDER_EVENT, payload)
        document.dispatchEvent(event)
    }

    static dispatchRegisterForm(form) {
        FormEventDispatcher.dispatchProviderEvent(onRegisterForm(form))
    }
    
    static dispatchUnregisterForm(form) {
        FormEventDispatcher.dispatchProviderEvent(onUnregisterForm(form))
    }
    
    static dispatchSubmitForm(form, formRef) {
        FormEventDispatcher.dispatchProviderEvent(onSubmitForm(form, formRef))
    }
    
    static dispatchResetForm(form) {
        FormEventDispatcher.dispatchProviderEvent(onResetForm(form))
    }

    static dispatchRegisterField(form, field, fieldCtrl) {
        FormEventDispatcher.dispatchProviderEvent(onRegisterField(form, field, fieldCtrl))
    }

    static dispatchUnregisterField(form, field) {
        FormEventDispatcher.dispatchProviderEvent(onUnregisterField(form, field))
    }

    static dispatchFieldPropsChanged(form, field, props) {
        FormEventDispatcher.dispatchProviderEvent(onFieldPropsChanged(form, field, props))
    }

    static dispatchFieldChanged(form, field, value, files) {
        FormEventDispatcher.dispatchProviderEvent(onFieldChanged(form, field, value, files))
    }

    static dispatchFieldBlur(form, field) {
        FormEventDispatcher.dispatchProviderEvent(onFieldBlur(form, field))
    }

    static dispatchRegisterFieldArray(form, name, withEmptyEntry, initialValues) {
        FormEventDispatcher.dispatchProviderEvent(onRegisterFieldArray(form, name, withEmptyEntry, initialValues))
    }

    static dispatchRegisterValidators(validators) {
        FormEventDispatcher.dispatchProviderEvent(onRegisterValidators(validators))
    }

    static dispatchFieldArrayEntryPush(form, name, initialValues) {
        FormEventDispatcher.dispatchProviderEvent(onFieldArrayEntryPush(form, name, initialValues))
    }
    
    static dispatchFieldArrayEntryRemove(form, name, index) {
        FormEventDispatcher.dispatchProviderEvent(onFieldArrayEntryRemove(form, name, index))
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