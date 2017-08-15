import React from 'react'

import {FormEventDispatcher} from './provider'

export class Form extends React.Component {

    constructor(props) {
        super(props)

    }

    componentWillMount() {
        FormEventDispatcher.dispatchRegisterForm(props.name)
    }

    componentWillUnmount() {
        FormEventDispatcher.dispatchUnregisterForm(props.name)
    }
}