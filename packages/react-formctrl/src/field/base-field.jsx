import React from 'react'
import PropTypes from 'prop-types'

import { compareFieldProps } from '../provider/provider.utils'
import { REACT_FORMCTRL } from '../provider/provider.actions'

export class BaseField extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        className: PropTypes.string,
        required: PropTypes.bool,
        pattern: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(RegExp)
        ]),
        type: PropTypes.string,
        integer: PropTypes.bool,
        inject: PropTypes.func,
        match: PropTypes.string,
        min: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        max: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        minLength: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        maxLength: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        accept: PropTypes.string,
        extensions: PropTypes.arrayOf(PropTypes.string),
        maxSize: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        validate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        children: PropTypes.any,
    }

    constructor(props) {
        super(props)

        this.getFieldChangeEventName = this.getFieldId.bind(this)
        this.dispatchRegisterField = this.dispatchRegisterField.bind(this)
        this.dispatchFieldPropsChanged = this.dispatchFieldPropsChanged.bind(this)
        this.dispatchUnregisterField = this.dispatchUnregisterField.bind(this)
        this.dispatchFieldChanged = this.dispatchFieldChanged.bind(this)
        this.dispatchFieldBlur = this.dispatchFieldBlur.bind(this)

        this.onChange = this.onChange.bind(this)
        this.handleFieldChangeForward = this.handleFieldChangeForward.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.getChildProps = this.getChildProps.bind(this)
        this.inject = this.inject.bind(this)
        this.getFieldProps = this.getFieldProps.bind(this)

        this.state = {
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
            initialValue: props.initialValue || '',
            props: this.getFieldProps(props)
        }
    }

    componentWillMount() {
        const { children } = this.props
        if (Array.isArray(children) && children.length > 1) {
            throw `The Field component for "${this.getFieldId()}" should have only one child, but has ${children.length}.`
        }
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${this.getFieldId()}`, this.handleFieldChangeForward)
        this.dispatchRegisterField()
    }

    componentWillReceiveProps(nextProps) {
        const nextFieldProps = this.getFieldProps(nextProps)
        if(!compareFieldProps(this.state.props, nextFieldProps)) {
            this.dispatchFieldPropsChanged(nextFieldProps)
        }
    }

    componentWillUnmount() {
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${this.getFieldId()}`, this.handleFieldChangeForward)
        this.dispatchUnregisterField()
    }

    // getFieldId();
    // dispatchRegisterField();
    // dispatchUnregisterField();
    // dispatchFieldPropsChanged(nextFieldProps);
    // dispatchFieldChanged(value, files);
    // dispatchFieldBlur(newState);

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

    onChange(fieldCtrl) {
        const { onChange } = this.props
        if (typeof onChange === 'function') {
            onChange(fieldCtrl)
        }
    }

    handleFieldChangeForward(event) {
        const payload = event.detail
        const fieldCtrl = payload.fieldCtrl
        this.setState(fieldCtrl)
        this.onChange(fieldCtrl)
    }

    handleChange(event) {
        const target = event.target
        const value = target.value
        const files = target.files
        this.dispatchFieldChanged(value, files)
    }

    handleBlur(event) {
        if (this.state.untouched) {
            this.dispatchFieldBlur({ ...this.state, touched: true, untouched: false })
        }
    }

    getChildProps() {
        const props = {}
        props.name = this.props.name
        props.ctrl = {
            valid: this.state.valid,
            invalid: this.state.invalid,
            untouched: this.state.untouched,
            touched: this.state.touched,
            pristine: this.state.pristine,
            dirty: this.state.dirty,
            unchanged: this.state.unchanged,
            changed: this.state.changed,
            errors: this.state.errors,
        }
        props.accept = this.props.accept
        props.extensions = this.props.extensions
        props.maxSize = this.props.maxSize
        props.className = this.props.className
        props.value = this.state.value
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