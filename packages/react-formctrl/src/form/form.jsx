import React from 'react'
import PropTypes from 'prop-types'

import {FormEventDispatcher} from '../provider/provider'
import {REACT_FORMCTRL} from '../provider/provider.actions'
import {ensureStringValue} from '../provider/provider.utils'

export class Form extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        className: PropTypes.string,
        onSubmit: PropTypes.func,
        onReset: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            ref: `${Math.random() * 999999999999999999}-${new Date().getTime()}`
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleFormSubmitForward = this.handleFormSubmitForward.bind(this)
        this.handleFormResetForward = this.handleFormResetForward.bind(this)
    }

    handleSubmit(event) {
        const {name} = this.props
        const {ref} = this.state
        event.preventDefault()
        FormEventDispatcher.dispatchSubmitForm(name, ref)
    }

    handleReset(event) {
        const {name} = this.props
        const {ref} = this.state
        event.preventDefault()
        FormEventDispatcher.dispatchResetForm(name, ref, event.type)
    }
    
    componentWillMount() {
        const {name} = this.props
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${name}`, this.handleFormSubmitForward)
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_RESETED}#${name}`, this.handleFormResetForward)
        FormEventDispatcher.dispatchRegisterForm(name)
    }
    
    handleFormSubmitForward(event) {
        const {onSubmit} = this.props
        if(typeof onSubmit === 'function') {
            const {values, formCtrl, formRef} = event.detail
            if(formRef == this.state.ref) {
                onSubmit(values, formCtrl)
            }
        }
    }
    
    handleFormResetForward(event) {
        const {onReset} = this.props
        if(typeof onReset === 'function') {
            const {formRef} = event.detail
            if(formRef == this.state.ref) {
                onReset()
            }
        }
    }
    
    componentWillUnmount() {
        const {name} = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${name}`, this.handleFormSubmitForward)
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_RESETED}#${name}`, this.handleFormResetForward)
        FormEventDispatcher.dispatchUnregisterForm(name)
    }
    
    render() {
        const {handleSubmit, handleReset} = this
        const {name, children, className} = this.props
        return (
            <form id={name} name={name} className={className} onSubmit={handleSubmit} onReset={handleReset} noValidate>
                {children}
            </form>
        )
    }

}

export class FormControl extends React.Component {

    static propTypes = {
        form: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        inject: PropTypes.func,
    }

    constructor(props) {
        super(props)
        this.state = {
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
        this.onChange = this.onChange.bind(this)
        this.handleFormChanged = this.handleFormChanged.bind(this)
        this.inject = this.inject.bind(this)
        this.setFieldValue = this.setFieldValue.bind(this)
    }

    componentWillMount() {
        const {form, children} = this.props
        if(Array.isArray(children) && children.length > 1) {
            throw `The FormControl component for "${form}" should have only one child, but has ${children.length}.`
        }
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_CHANGED}#${form}`, this.handleFormChanged)
    }
    
    componentWillUnmount() {
        const {form} = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_CHANGED}#${form}`, this.handleFormChanged)
    }

    onChange(formCtrl) {
        const {onChange} = this.props
        if(typeof onChange === 'function') {
            onChange(formCtrl)
        }
    }

    handleFormChanged(event) {
        const payload = event.detail
        const {form} = this.props
        const {formCtrl} = payload
        this.setState(formCtrl)
        this.onChange(formCtrl)
    }

    setFieldValue(fieldName, value) {
        const {form} = this.props
        const fieldCtrl = this.state.fields[fieldName]
        if(fieldCtrl) {
            FormEventDispatcher.dispatchFieldChanged(form, fieldName, ensureStringValue(value, fieldCtrl.props.type))
        } else {
            console.warn(`Field "${fieldName}" not found on form ${form}`)
        }
    }

    inject() {
        const {inject, form} = this.props
        const formCtrl = {...this.state, formName: form, setFieldValue: this.setFieldValue}
        if(typeof inject === 'function') {
            return inject(formCtrl)
        }
        return {formCtrl}
    }

    render() {
        const {children} = this.props
        return React.cloneElement(children, {...children.props, ...this.inject()})
    }

}