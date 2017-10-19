import React from 'react'
import PropTypes from 'prop-types'

import { FormEventDispatcher } from '../provider/provider'
import { REACT_FORMCTRL } from '../provider/provider.actions'
import { BaseField } from './base-field'

export class FieldArray extends React.Component {

    static propTypes = {
        form: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startEmpty: PropTypes.bool,
        initialValues: PropTypes.arrayOf(PropTypes.any),
        render: PropTypes.func
    }

    constructor(props) {
        super(props)

        this.state = {
            ctrls: []
        }
    }

}

export class FieldArrayEntry extends BaseField {

    static propTypes = {
        ...BaseField.propTypes,
        entry: PropTypes.shape({
            form: PropTypes.string.isRequired,
            group: PropTypes.string.isRequired,
            index: PropTypes.number.isRequired
        }).isRequired,
    }

    getFieldId() {
        const { entry: { form, group } } = this.props
        return `${form}#${group}`
    }

    dispatchRegisterField() {
        const { entry: { form, group, index }, name } = this.props
        FormEventDispatcher.dispatchRegisterField(form, name, this.state, group, index)
    }

    dispatchFieldPropsChanged(nextFieldProps) {
        const { entry: { form, group, index }, name } = this.props
        FormEventDispatcher.dispatchFieldPropsChanged(form, name, nextFieldProps, group, index)
    }

    dispatchUnregisterField() {
        const { entry: { form, group, index }, name } = this.props
        FormEventDispatcher.dispatchUnregisterField(form, name, group, index)
    }

    dispatchFieldChanged(value, files) {
        const { entry: { form, group, index }, name } = this.props
        FormEventDispatcher.dispatchFieldChanged(form, name, value, files, group, index)
    }

    dispatchFieldBlur(nextState) {
        const { entry: { form, group, index }, name } = this.props
        FormEventDispatcher.dispatchFieldBlur(form, name, nextState, group, index)
    }

    getChildProps() {
        const { entry: { form, group, index } } = this.props
        return {
            ...super.getChildProps(),
            formName: form,
            group,
            index
        }
    }


}