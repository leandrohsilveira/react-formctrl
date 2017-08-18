import React from 'react'

import {FormEventDispatcher, REACT_FORMCTRL} from './provider'

const INTEGER_REGEX = /^-?\d+?$/
const FLOAT_REGEX = /^-?\d+(\.\d+)?$/
const EMAIL_REGEX = /\S+@\S+\.\S+/

export class Field extends React.Component {

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
            errors: [],
            value: '',
            initialValue: props.initialValue
        }

        this.handleFieldChangeForward = this.handleFieldChangeForward.bind(this)
        this.handleFormResetForward = this.handleFormResetForward.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.updateFieldCtrl = this.updateFieldCtrl.bind(this)
        this.getChildProps = this.getChildProps.bind(this)
        this.transformProps = this.transformProps.bind(this)
        this.sync = this.sync.bind(this)
    }

    componentWillMount() {
        const {form, name, children, initialValue = ''} = this.props
        if(Array.isArray(children) && children.length > 1) {
            throw `The Field component for "${form}#${name}" should have only one child, but has ${children.length}.`
        }
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_RESETED}#${form}`, this.handleFormResetForward)

        const fieldCtrl = this.updateFieldCtrl(initialValue)
        fieldCtrl.value = initialValue
        FormEventDispatcher.dispatchRegisterField(form, name, fieldCtrl)
    }
    
    componentWillUnmount() {
        const {form, name} = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_RESETED}#${form}`, this.handleFormResetForward)
        FormEventDispatcher.dispatchUnregisterField(form, name)
    }

    updateFieldCtrl(value) {
        const errors = []
        const {
            form, 
            name, 
            type, 
            required, 
            pattern, 
            match, 
            integer,
            min,
            max,
            minLength,
            maxLength,
            initialValue = ''
        } = this.props
        if(required && !value) errors.push('required')
        else if(pattern && !new RegExp(pattern).test(value)) errors.push('pattern')
        else {
            if(type === 'email' && !EMAIL_REGEX.test(value)) errors.push('email')
            if(type === 'number') {
                if(integer && !INTEGER_REGEX.test(value)) errors.push('integer')
                if(!integer && !FLOAT_REGEX.test(value)) errors.push('float')
                if(min && +value < min) errors.push('min')
                if(max && +value > max) errors.push('max')
            } else {
                if(minLength && value && value.length < minLength) errors.push('minLength')
                if(maxLength && value && value.length > maxLength) errors.push('maxLength')
            }
        }
        return {
            ...this.state, 
            errors, 
            unchanged: value === initialValue,
            changed: value !== initialValue,
            valid: errors.length === 0, 
            invalid: errors.length > 0
        }
    }

    handleFieldChangeForward(event) {
        const payload = event.detail
        const fieldCtrl = payload.fieldCtrl
        const syncState = this.sync(fieldCtrl)
        if(Object.keys(syncState).length) {
            this.setState(syncState)
        }
    }

    handleFormResetForward(event) {
        const {form, name, children, initialValue = ''} = this.props
        const fieldCtrl = this.updateFieldCtrl(initialValue)
        fieldCtrl.value = initialValue
        fieldCtrl.pristine = true
        fieldCtrl.dirty = false
        fieldCtrl.untouched = true
        fieldCtrl.touched = false
        FormEventDispatcher.dispatchFieldChanged(form, name, fieldCtrl)
    }

    handleChange(event) {
        const {updateFieldCtrl, sync} = this
        const {form, name} = this.props
        const value = event.target.value
        const fieldCtrl = updateFieldCtrl(value)
        fieldCtrl.value = value
        fieldCtrl.pristine = false
        fieldCtrl.dirty = true
        const syncState = sync(fieldCtrl)
        if(Object.keys(syncState).length) {
            FormEventDispatcher.dispatchFieldChanged(form, name, fieldCtrl)
        }
    }

    handleBlur(event) {
        if(this.state.untouched) {
            const {form, name} = this.props
            FormEventDispatcher.dispatchFieldChanged(form, name, {...this.state, touched: true, untouched: false})
        }
    }

    sync(fieldCtrl) {
        const syncState = {}
        if(JSON.stringify(this.state.errors) !== JSON.stringify(fieldCtrl.errors)) syncState.errors = fieldCtrl.errors
        if(this.state.valid !== fieldCtrl.valid) syncState.valid = fieldCtrl.valid
        if(this.state.invalid !== fieldCtrl.invalid) syncState.invalid = fieldCtrl.invalid
        if(this.state.untouched !== fieldCtrl.untouched) syncState.untouched = fieldCtrl.untouched
        if(this.state.touched !== fieldCtrl.touched) syncState.touched = fieldCtrl.touched
        if(this.state.pristine !== fieldCtrl.pristine) syncState.pristine = fieldCtrl.pristine
        if(this.state.dirty !== fieldCtrl.dirty) syncState.dirty = fieldCtrl.dirty
        if(this.state.unchanged !== fieldCtrl.unchanged) syncState.unchanged = fieldCtrl.unchanged
        if(this.state.changed !== fieldCtrl.changed) syncState.changed = fieldCtrl.changed
        if(this.state.value !== fieldCtrl.value) syncState.value = fieldCtrl.value
        if(this.state.__instances != fieldCtrl.__instances) syncState.__instances = fieldCtrl.__instances
        return syncState
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
        props.className = this.props.className
        props.value = this.state.value
        props.required = this.props.required
        props.pattern = this.props.pattern
        props.type = this.props.type || 'text'
        props.onChange = this.handleChange
        props.onBlur = this.handleBlur
        return props
    }

    transformProps(childProps) {
        const {transformProps} = this.props
        const props = this.getChildProps()
        if(typeof transformProps === 'function') {
            return transformProps(props)
        }
        return props
    }

    render() {
        const {getChildProps, transformProps} = this
        const {children} = this.props
        let child = children
        if(Array.isArray(children)) {
            child = children[0]
        }
        return React.cloneElement(child, {...child.props, ...transformProps()})
    }
}