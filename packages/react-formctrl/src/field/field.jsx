import React from 'react'
import PropTypes from 'prop-types'

import { FormEventDispatcher } from '../provider/provider'
import { REACT_FORMCTRL } from '../provider/provider.actions'
import { BaseField } from './base-field'

export class Field extends BaseField {

    static propTypes = {
        ...BaseField.propTypes,
        form: PropTypes.string.isRequired,
    }

    getFieldId() {
        const {form, name} = this.props
        return `${form}#${name}`
    }

    dispatchRegisterField() {
        const { form, name, children } = this.props
        FormEventDispatcher.dispatchRegisterField(form, name, this.state)
    }

    dispatchFieldPropsChanged(nextFieldProps) {
        FormEventDispatcher.dispatchFieldPropsChanged(this.props.form, this.props.name, nextFieldProps)
    }

    dispatchUnregisterField() {
        const { form, name } = this.props
        FormEventDispatcher.dispatchUnregisterField(form, name)
    }

    dispatchFieldChanged(value, files) {
        const { form, name } = this.props
        FormEventDispatcher.dispatchFieldChanged(form, name, value, files)
    }

    dispatchFieldBlur(nextState) {
        const { form, name } = this.props
        FormEventDispatcher.dispatchFieldBlur(form, name, nextState)
    }

    getChildProps() {
        return {
            ...super.getChildProps(),
            formName: this.props.form
        }
    }

}