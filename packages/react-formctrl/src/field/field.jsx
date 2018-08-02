import React from 'react'
import PropTypes from 'prop-types'

import { compareFieldProps, ensureStringValue } from '../provider/provider.utils'
import { onFieldPropsChanged, onRegisterField, onFieldBlur, onUnregisterField, onFieldChanged } from './../provider/provider.actions';
import { FormContext } from '../provider/provider';

class FieldWrapper extends React.Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onReset = this.onReset.bind(this)
        this.handleFormsChange = this.handleFormsChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.getChildProps = this.getChildProps.bind(this)
        this.inject = this.inject.bind(this)
        this.getFieldProps = this.getFieldProps.bind(this)
    }

    componentWillMount() {
        const { form, name, children, dispatch } = this.props
        if (Array.isArray(children) && children.length > 1) {
            throw `The Field component for "${form}#${name}" should have only one child, but has ${children.length}.`
        }

        dispatch(onRegisterField(form, name, {
            valid: true,
            invalid: false,
            untouched: true,
            touched: false,
            pristine: true,
            dirty: false,
            unchanged: true,
            changed: false,
            errors: [],
            value: '',
            files: [],
            initialValue: ensureStringValue(this.props.initialValue || '', this.props.type),
            props: this.getFieldProps(this.props)
        }))
    }

    componentWillReceiveProps(nextProps) {
        const nextFieldProps = this.getFieldProps(nextProps)
        const currentFieldProps = this.getFieldProps(this.props)
        if (!compareFieldProps(currentFieldProps, nextFieldProps)) {
            const { dispatch } = nextProps
            dispatch(onFieldPropsChanged(currentFieldProps.form, currentFieldProps.name, nextFieldProps))
        }
    }

    componentWillUnmount() {
        const { form, name, dispatch } = this.props
        dispatch(onUnregisterField(form, name))
    }

    getFieldProps(props) {
        return {
            name: props.name,
            form: props.form,
            type: props.type,
            required: props.required,
            pattern: props.pattern,
            match: props.match,
            integer: props.integer,
            min: props.min,
            max: props.max,
            minLength: props.minLength,
            maxLength: props.maxLength,
            accept: props.accept,
            extensions: props.extensions || [],
            maxSize: props.maxSize,
            validate: props.validate
        }
    }

    onBlur(fieldCtrl) {
        const { afterBlur } = this.props
        if (typeof afterBlur === 'function') {
            afterBlur(fieldCtrl)
        }
    }

    onReset(fieldCtrl) {
        const { afterReset } = this.props
        if (typeof afterReset === 'function') {
            afterReset(fieldCtrl)
        }
    }

    onChange(fieldCtrl) {
        const { afterChange } = this.props
        if (typeof afterChange === 'function') {
            afterChange(fieldCtrl)
        }
    }

    handleFormsChange(forms) {
        const { form, name } = this.props;
        const formCtrl = forms[form]
        if (formCtrl) {
            return formCtrl.fields[name]
        }
        return null;
    }

    handleChange(event) {
        const { form, name, dispatch } = this.props
        const target = event.target
        const value = target.value
        const files = target.files

        dispatch(onFieldChanged(form, name, value, files))
            .then(this.handleFormsChange)
            .then(this.onChange)
    }

    handleBlur() {
        const { form, name, dispatch } = this.props
        dispatch(onFieldBlur(form, name))
            .then(this.handleFormsChange)
            .then(this.onBlur)
    }

    getChildProps() {
        const { fieldCtrl = {} } = this.props
        const props = {}
        props.name = this.props.name
        props.formName = this.props.form
        props.ctrl = {
            valid: fieldCtrl.valid,
            invalid: fieldCtrl.invalid,
            untouched: fieldCtrl.untouched,
            touched: fieldCtrl.touched,
            pristine: fieldCtrl.pristine,
            dirty: fieldCtrl.dirty,
            unchanged: fieldCtrl.unchanged,
            changed: fieldCtrl.changed,
            errors: fieldCtrl.errors,
        }
        props.accept = this.props.accept
        props.extensions = this.props.extensions
        props.maxSize = this.props.maxSize
        props.className = this.props.className
        props.value = fieldCtrl.value
        props.required = this.props.required
        props.pattern = this.props.pattern
        props.type = this.props.type || 'text'
        props.onChange = this.handleChange
        props.onBlur = this.handleBlur
        return props
    }

    inject() {
        const { inject } = this.props
        const props = this.getChildProps()
        if (typeof inject === 'function') {
            return inject(props)
        }
        return props
    }

    render() {
        const { children } = this.props
        return React.cloneElement(children, { ...children.props, ...this.inject() })
    }
}

export const Field = ({children, ...rest}) => (
    <FormContext.Consumer>
        {({ forms, dispatch }) => {
            const formCtrl = forms[rest.form]
            if (formCtrl) {
                const fieldCtrl = formCtrl.fields[rest.name]
                return (
                    <FieldWrapper
                        {...rest}
                        dispatch={dispatch}
                        fieldCtrl={fieldCtrl}
                    >
                        {children}
                    </FieldWrapper>
                )
            }
            return null
        }}
    </FormContext.Consumer>
)
// Field.propTypes = {
//     name: PropTypes.string.isRequired,
//     form: PropTypes.string.isRequired,
//     className: PropTypes.string,
//     required: PropTypes.bool,
//     pattern: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.instanceOf(RegExp)
//     ]),
//     type: PropTypes.string,
//     integer: PropTypes.bool,
//     inject: PropTypes.func,
//     match: PropTypes.string,
//     min: PropTypes.oneOfType([
//         PropTypes.number,
//         PropTypes.string,
//     ]),
//     max: PropTypes.oneOfType([
//         PropTypes.number,
//         PropTypes.string,
//     ]),
//     minLength: PropTypes.oneOfType([
//         PropTypes.number,
//         PropTypes.string,
//     ]),
//     maxLength: PropTypes.oneOfType([
//         PropTypes.number,
//         PropTypes.string,
//     ]),
//     accept: PropTypes.string,
//     extensions: PropTypes.arrayOf(PropTypes.string),
//     maxSize: PropTypes.oneOfType([
//         PropTypes.number,
//         PropTypes.string
//     ]),
//     validate: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.arrayOf(PropTypes.string)
//     ]),
//     initialValue: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.number,
//         PropTypes.instanceOf(Date)
//     ]),
//     afterChange: PropTypes.func,
//     afterBlur: PropTypes.func,
//     afterReset: PropTypes.func,
// }