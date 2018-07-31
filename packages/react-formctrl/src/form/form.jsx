import React from 'react'
import PropTypes from 'prop-types'

import { ensureStringValue } from '../provider/provider.utils'
import { onSubmitForm, onResetForm, onRegisterForm, onUnregisterForm, onFieldChanged } from './../provider/provider.actions';
import { FormContext } from '../provider/provider';

class WrappedForm extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleFormSubmitForward = this.handleFormSubmitForward.bind(this)
        this.handleFormResetForward = this.handleFormResetForward.bind(this)
        this.dispatch = this.dispatch.bind(this);
    }

    dispatch(action) {
        const { name, dispatch } = this.props;
        return dispatch(action)
            .then(forms => forms[name]);
    }

    handleSubmit(event) {
        const { name } = this.props
        event.preventDefault()
        this.dispatch(onSubmitForm(name))
            .then(this.handleFormSubmitForward)
    }

    handleReset(event) {
        const { name } = this.props
        event.preventDefault()
        this.dispatch(onResetForm(name, event.type))
            .then(this.handleFormResetForward)
    }

    componentWillMount() {
        const { name } = this.props
        this.dispatch(onRegisterForm(name))
    }

    handleFormSubmitForward({ values, formCtrl }) {
        const { onSubmit } = this.props
        if (typeof onSubmit === 'function') {
            onSubmit(values, formCtrl)
        }
    }

    handleFormResetForward() {
        const { onReset } = this.props
        if (typeof onReset === 'function') {
            onReset()
        }
    }

    componentWillUnmount() {
        const { name } = this.props
        this.dispatch(onUnregisterForm(name))
    }

    render() {
        const { handleSubmit, handleReset } = this
        const { name, children, className } = this.props
        return (
            <form id={name} name={name} className={className} onSubmit={handleSubmit} onReset={handleReset} noValidate>
                {children}
            </form>
        )
    }

}

export const Form = React.forwardRef(({children, ...rest}, ref) => (
    <FormContext.Consumer>
        {({ dispatch }) => (
            <WrappedForm
                {...rest}
                ref={ref}
                dispatch={dispatch}
            >
                {children}
            </WrappedForm>
        )}
    </FormContext.Consumer>
))
// Form.propTypes = {
//     name: PropTypes.string.isRequired,
//     className: PropTypes.string,
//     onSubmit: PropTypes.func,
//     onReset: PropTypes.func
// }

class WrappedFormControl extends React.Component {

    constructor(props) {
        super(props)
        this.handleFormChanged = this.handleFormChanged.bind(this)
        this.inject = this.inject.bind(this)
        this.setFieldValue = this.setFieldValue.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentWillMount() {
        const { form, children } = this.props
        if (Array.isArray(children) && children.length > 1) {
            throw `The FormControl component for "${form}" should have only one child, but has ${children.length}.`
        }
    }

    componentWillReceiveProps(nextProps) {
        const { form, onChange, formCtrl } = nextProps
        if (typeof onChange === 'function') {
            onChange({ ...formCtrl, formName: form, setFieldValue: this.setFieldValue, reset: this.reset })
        }
    }

    setFieldValue(fieldName, value) {
        const { form, formCtrl, dispatch } = this.props
        const fieldCtrl = formCtrl.fields[fieldName]
        if (fieldCtrl) {
            dispatch(onFieldChanged(form, fieldName, ensureStringValue(value, fieldCtrl.props.type)))
        } else {
            console.warn(`Field "${fieldName}" not found on form ${form}`)
        }
    }

    reset() {
        const { form, dispatch } = this.props
        dispatch(onResetForm(form, 'reset'))
    }

    inject() {
        const { inject, form, formCtrl:currentFormCtrl } = this.props
        const formCtrl = { ...currentFormCtrl, formName: form, setFieldValue: this.setFieldValue, reset: this.reset }
        if (typeof inject === 'function') {
            return inject(formCtrl)
        }
        return { formCtrl }
    }

    render() {
        const { children } = this.props
        return React.cloneElement(children, { ...children.props, ...this.inject() })
    }

}
export const FormControl = React.createRef(({children, ...rest}, ref) => (
    <FormContext.Consumer>
        {({ forms, dispatch }) => (
            <WrappedFormControl
                {...rest}
                ref={ref}
                dispatch={dispatch}
                formCtrl={forms[props.form]}
            >
                {children}
            </WrappedFormControl>
        )}
    </FormContext.Consumer>
))
// FormControl.propTypes = {
//     form: PropTypes.string.isRequired,
//     onChange: PropTypes.func,
//     inject: PropTypes.func,
// }