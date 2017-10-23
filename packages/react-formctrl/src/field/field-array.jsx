import React from 'react'
import PropTypes from 'prop-types'

import { FormEventDispatcher } from '../provider/provider'
import { REACT_FORMCTRL } from '../provider/provider.actions'
import { BaseField } from './base-field'

export class FieldArray extends React.Component {

    static propTypes = {
        form: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
        withEmptyEntry: PropTypes.bool,
        initialValues: PropTypes.arrayOf(PropTypes.any),
    }

    constructor(props) {
        super(props)

        this.state = {
            entries: []
        }
        
        this.handleFieldArrayChangeForward = this.handleFieldArrayChangeForward.bind(this)
        this.bindDispatchFieldArrayEntryPush = this.bindDispatchFieldArrayEntryPush.bind(this)
        this.bindDispatchFieldArrayEntryRemove = this.bindDispatchFieldArrayEntryRemove.bind(this)
    }
    
    componentWillMount() {
        document.addEventListener(`${REACT_FORMCTRL.EVENTS.FIELD_ARRAY_CHANGED}#${form}#${group}`, this.handleFieldArrayChangeForward)
    }

    handleFieldArrayChangeForward(event) {
        this.setState(state => {
            entries: event.detail.entries.map(entry => ({
                ...entry,
                removeEntry: this.bindDispatchFieldArrayEntryRemove(entry.index)
            }))
        })
    }

    bindDispatchFieldArrayEntryRemove(index) {
        const {form, name} = this.props
        return () => FormEventDispatcher.dispatchFieldArrayEntryRemove(form, name, index)
    }
    
    bindDispatchFieldArrayEntryPush() {
        const {form, name} = this.props
        return (initialValues) => FormEventDispatcher.dispatchFieldArrayEntryPush(form, name, initialValues)
    }

    render() {
        return this.props.render(this.state.entries, this.bindDispatchFieldArrayEntryPush())
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
        const { entry: { form, group, index }, name } = this.props
        return `${form}#${group}#${index}#${name}`
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