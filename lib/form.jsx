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
        event.preventDefault()
        FormEventDispatcher.dispatchSubmitForm(name)
        
    }

    handleReset(event) {
        const {name} = this.props
        event.preventDefault()
        FormEventDispatcher.dispatchResetForm(name)
    }

    componentWillMount() {
        const {name, initialValues} = this.props
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITTED}#${name}`, this.handleFormSubmitForward)
        FormEventDispatcher.dispatchRegisterForm(name, initialValues)
    }

    handleFormSubmitForward(event) {
        if(typeof props.onSubmit === 'function') {
            const payload = event.detail
            const values = payload.values
            const formCtrl = payload.formCtrl
            props.onSubmit(values, formCtrl)
        }
    }

    componentWillUnmount() {
        document.removeEventListener(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITTED}#${props.name}`, this.handleFormSubmitForward)
        FormEventDispatcher.dispatchUnregisterForm(props.name)
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