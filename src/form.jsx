import React from 'react'

import {FormEventDispatcher, REACT_FORMCTRL} from './provider'

export class Form extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleFormSubmitForward = this.handleFormSubmitForward.bind(this)
    }

    handleSubmit(event) {
        const {name} = this.props
        event.preventDefault()
        FormEventDispatcher.dispatchSubmitForm(name, this)
    }

    handleReset(event) {
        const {name} = this.props
        event.preventDefault()
        FormEventDispatcher.dispatchResetForm(name)
    }

    componentWillMount() {
        const {name} = this.props
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${name}`, this.handleFormSubmitForward)
        FormEventDispatcher.dispatchRegisterForm(name)
    }
    
    handleFormSubmitForward(event) {
        const {onSubmit} = this.props
        if(typeof onSubmit === 'function') {
            const {values, formCtrl, formRef} = event.detail
            if(formRef == this) {
                onSubmit(values, formCtrl)
            }
        }
    }
    
    componentWillUnmount() {
        const {name} = this.props
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${name}`, this.handleFormSubmitForward)
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
            values: {}
        }
        this.handleFormChanged = this.handleFormChanged.bind(this)
        this.sync = this.sync.bind(this)
        this.transformProps = this.transformProps.bind(this)
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

    handleFormChanged(event) {
        const payload = event.detail
        const {form} = this.props
        const {formCtrl} = payload
        const syncState = this.sync(formCtrl)
        if(Object.keys(syncState).length > 0) {
            this.setState(syncState)
        }
    }

    sync(formCtrl) {
        const syncState = {}
        if(JSON.stringify(this.state.values) !== JSON.stringify(formCtrl.values)) syncState.values = {...formCtrl.values}
        if(JSON.stringify(this.state.fields) !== JSON.stringify(formCtrl.fields)) syncState.fields = {...formCtrl.fields}
        if(this.state.valid !== formCtrl.valid) syncState.valid = formCtrl.valid
        if(this.state.invalid !== formCtrl.invalid) syncState.invalid = formCtrl.invalid
        if(this.state.untouched !== formCtrl.untouched) syncState.untouched = formCtrl.untouched
        if(this.state.touched !== formCtrl.touched) syncState.touched = formCtrl.touched
        if(this.state.pristine !== formCtrl.pristine) syncState.pristine = formCtrl.pristine
        if(this.state.dirty !== formCtrl.dirty) syncState.dirty = formCtrl.dirty
        if(this.state.unchanged !== formCtrl.unchanged) syncState.unchanged = formCtrl.unchanged
        if(this.state.changed !== formCtrl.changed) syncState.changed = formCtrl.changed
        return syncState
    }

    transformProps() {
        const {transformProps} = this.props
        if(typeof transformProps === 'function') {
            return transformProps(this.state)
        }
        return this.state
    }

    render() {
        const {children} = this.props
        let child = children
        if(Array.isArray(children)) {
            child = children[0]
        }
        return React.cloneElement(child, {...child.props, ...this.transformProps()})
    }

}