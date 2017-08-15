import React from 'react'

import {FormEventDispatcher, REACT_FORMCTL} from './provider'

export class Form extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        FormEventDispatcher.dispatchSubmitForm(props.name)
        document.addEventListener(`${REACT_FORMCTL.EVENTS.FORM_SUBMITTED}#${props.name}`, ({detail: {values, formCtrl}}) => {
            if(typeof props.onSubmit === 'function') {
                props.onSubmit(values, formCtrl)
            }
        })
    }

    componentWillMount() {
        FormEventDispatcher.dispatchRegisterForm(props.name, props.initialValues)
    }

    componentWillUnmount() {
        FormEventDispatcher.dispatchUnregisterForm(props.name)
    }

    render() {
        const {handleSubmit} = this
        const {name, children} = this.props
        return (
            <form id={name} name={name} onSubmit={handleSubmit}>
                {children}
            </form>
        )
    }

}