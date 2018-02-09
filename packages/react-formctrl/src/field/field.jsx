import React from 'react'
import PropTypes, { instanceOf } from 'prop-types'

import { FormEventDispatcher } from '../provider/provider'
import { REACT_FORMCTRL } from '../provider/provider.actions'
import { compareFieldProps, formatDate, formatDateTime, ensureStringValue } from '../provider/provider.utils'

export class Field extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        form: PropTypes.string.isRequired,
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
        initialValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.instanceOf(Date)
        ]),
        afterChange: PropTypes.func,
        afterBlur: PropTypes.func,
        afterReset: PropTypes.func,
    }

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onReset = this.onReset.bind(this)
        this.handleFieldChangeForward = this.handleFieldChangeForward.bind(this)
        this.handleMatchFieldChangeForward = this.handleMatchFieldChangeForward.bind(this)
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
            initialValue: ensureStringValue(props.initialValue || '', props.type),
            props: this.getFieldProps(props)
        }

    }

    componentWillMount() {
        const { form, name, children, match } = this.props
        if (Array.isArray(children) && children.length > 1) {
            throw `The Field component for "${form}#${name}" should have only one child, but has ${children.length}.`
        }
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)
        if(match) {
            document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${match}`, this.handleMatchFieldChangeForward)
        }

        FormEventDispatcher.dispatchRegisterField(form, name, this.state)
    }


    componentWillReceiveProps(nextProps) {
        const nextFieldProps = this.getFieldProps(nextProps)
        if(!compareFieldProps(this.state.props, nextFieldProps)) {
            FormEventDispatcher.dispatchFieldPropsChanged(this.props.form, this.props.name, nextFieldProps)
        }
    }

    componentWillUnmount() {
        const { form, name, match } = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)
        if(match) {
            document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${match}`, this.handleMatchFieldChangeForward)
        }
        FormEventDispatcher.dispatchUnregisterField(form, name)
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

    handleFieldChangeForward(event) {
        const payload = event.detail
        const fieldCtrl = payload.fieldCtrl
        const eventType = payload.eventType
        this.setState(
            fieldCtrl, 
            () => {
                switch(eventType) {
                    case 'blur':
                        this.onBlur(fieldCtrl)
                        break;
                    case 'reset':
                        this.onReset(fieldCtrl)
                        break;
                    default:
                        this.onChange(fieldCtrl)
                        break;
                }
            }
        )
    }

    handleMatchFieldChangeForward(event) {
        const {value, files, valid} = this.state
        const {form, name} = this.props
        const payload = event.detail
        const fieldCtrl = payload.fieldCtrl
        if(payload.eventType === 'change') {
            FormEventDispatcher.dispatchFieldChanged(form, name, value, files, 'change')
        }
    }

    handleChange(event) {
        const { sync } = this
        const { form, name } = this.props
        const target = event.target
        const value = target.value
        const files = target.files 
        FormEventDispatcher.dispatchFieldChanged(form, name, value, files, event.type)
    }

    handleBlur(event) {
        if (this.state.untouched) {
            const { form, name } = this.props
            FormEventDispatcher.dispatchFieldBlur(form, name, event.type)
        } else {
            this.onBlur(this.state)
        }
    }

    getChildProps() {
        const props = {}
        props.name = this.props.name
        props.formName = this.props.form
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
        const { inject } = this
        const { children } = this.props
        return React.cloneElement(children, { ...children.props, ...inject() })
    }
}