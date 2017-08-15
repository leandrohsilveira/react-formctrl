import React from 'react'

import {FormEventDispatcher, REACT_FORMCTL} from './provider'

export class Form extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.forwardSubmit = this.forwardSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        FormEventDispatcher.dispatchSubmitForm(props.name)
        
    }

    handleReset(event) {
        event.preventDefault()
        FormEventDispatcher.dispatchResetForm(props.name)
    }

    componentWillMount() {
        FormEventDispatcher.dispatchRegisterForm(props.name, props.initialValues)
        document.addEventListener(`${REACT_FORMCTL.EVENTS.FORM_SUBMITTED}#${props.name}`, this.forwardSubmit)
    }

    forwardSubmit(event) {
        if(typeof props.onSubmit === 'function') {
            const payload = event.detail
            const values = payload.values
            const formCtrl = payload.formCtrl
            props.onSubmit(values, formCtrl)
        }
    }

    componentWillUnmount() {
        FormEventDispatcher.dispatchUnregisterForm(props.name)
        document.removeEventListener(`${REACT_FORMCTL.EVENTS.FORM_SUBMITTED}#${props.name}`, this.forwardSubmit)
    }

    render() {
        const {handleSubmit, handleReset} = this
        const {name, children} = this.props
        return (
            <form id={name} name={name} onSubmit={handleSubmit} onReset={handleReset}>
                {children}
            </form>
        )
    }

}