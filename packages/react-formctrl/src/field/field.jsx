import React from 'react'
import PropTypes from 'prop-types'

import { FormEventDispatcher, REACT_FORMCTRL } from '../provider/provider'

export class Field extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        form: PropTypes.string.isRequired,
        className: PropTypes.string,
        required: PropTypes.bool,
        pattern: PropTypes.oneOf([
            PropTypes.string,
            PropTypes.instanceOf(RegExp)
        ]),
        type: PropTypes.string,
        integer: PropTypes.bool,
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
            errors: [],
            value: '',
            initialValue: props.initialValue || '',
            props: {
                type: props.type,
                required: props.required,
                pattern: props.pattern,
                match: props.match,
                integer: props.integer,
                min: props.min,
                max: props.max,
                minLength: props.minLength,
                maxLength: props.maxLength,
            }
        }

        this.onChange = this.onChange.bind(this)
        this.handleFieldChangeForward = this.handleFieldChangeForward.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.getChildProps = this.getChildProps.bind(this)
        this.inject = this.inject.bind(this)
        this.sync = this.sync.bind(this)
    }

    componentWillMount() {
        const { form, name, children } = this.props
        if (Array.isArray(children) && children.length > 1) {
            throw `The Field component for "${form}#${name}" should have only one child, but has ${children.length}.`
        }
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)

        FormEventDispatcher.dispatchRegisterField(form, name, this.state)
    }

    componentWillUnmount() {
        const { form, name } = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${name}`, this.handleFieldChangeForward)
        FormEventDispatcher.dispatchUnregisterField(form, name)
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
        const syncState = this.sync(fieldCtrl)
        if (Object.keys(syncState).length) {
            this.setState(syncState)
            this.onChange(fieldCtrl)
        }
    }

    handleChange(event) {
        const { sync } = this
        const { form, name } = this.props
        const value = event.target.value
        FormEventDispatcher.dispatchFieldChanged(form, name, value)
    }

    handleBlur(event) {
        if (this.state.untouched) {
            const { form, name } = this.props
            FormEventDispatcher.dispatchFieldBlur(form, name, { ...this.state, touched: true, untouched: false })
        }
    }

    sync(fieldCtrl) {
        const syncState = {}
        if (JSON.stringify(this.state.errors) !== JSON.stringify(fieldCtrl.errors)) syncState.errors = fieldCtrl.errors
        if (this.state.valid !== fieldCtrl.valid) syncState.valid = fieldCtrl.valid
        if (this.state.invalid !== fieldCtrl.invalid) syncState.invalid = fieldCtrl.invalid
        if (this.state.untouched !== fieldCtrl.untouched) syncState.untouched = fieldCtrl.untouched
        if (this.state.touched !== fieldCtrl.touched) syncState.touched = fieldCtrl.touched
        if (this.state.pristine !== fieldCtrl.pristine) syncState.pristine = fieldCtrl.pristine
        if (this.state.dirty !== fieldCtrl.dirty) syncState.dirty = fieldCtrl.dirty
        if (this.state.unchanged !== fieldCtrl.unchanged) syncState.unchanged = fieldCtrl.unchanged
        if (this.state.changed !== fieldCtrl.changed) syncState.changed = fieldCtrl.changed
        if (this.state.value !== fieldCtrl.value) syncState.value = fieldCtrl.value
        if (this.state.__instances != fieldCtrl.__instances) syncState.__instances = fieldCtrl.__instances
        return syncState
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
        let child = children
        if (Array.isArray(children)) {
            child = children[0]
        }
        return React.cloneElement(child, { ...child.props, ...inject() })
    }
}