import React from 'react'
import PropTypes from 'prop-types'

import { ensureStringValue } from '../provider/provider.utils'
import { FormConsumer } from '../provider/provider';
import { onSubmitForm, onResetForm, onRegisterForm, onUnregisterForm, onFieldChanged } from './../provider/provider.actions';

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

const Form = React.forwardRef((props, ref) => (
    <FormConsumer>
        {({ dispatch }) => {
            <WrappedForm
                {...props}
                ref={ref}
                dispatch={dispatch}
            />
        }}
    </FormConsumer>
))
Form.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func
}

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
        const { inject, form, formCtrl } = this.props
        const formCtrl = { ...formCtrl, formName: form, setFieldValue: this.setFieldValue, reset: this.reset }
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

const FormControl = React.createRef((props, ref) => (
    <FormConsumer>
        {({ forms, dispatch }) => {
            <WrappedFormControl
                {...props}
                ref={ref}
                dispatch={dispatch}
                formCtrl={forms[props.form]}
            />
        }}
    </FormConsumer>
))

FormControl.propTypes = {
    form: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    inject: PropTypes.func,
}

export {
    Form,
    FormControl
}