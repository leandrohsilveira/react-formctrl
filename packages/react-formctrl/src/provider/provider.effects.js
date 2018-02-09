import { REACT_FORMCTRL } from './provider.actions'
import { copyFieldCtrl, copyFormCtrl, dispatchEvent } from './provider.utils'

function forwardSubmitFormEvent(form, values, formCtrl, formRef) {
    const payload = { values, formRef, formCtrl: copyFormCtrl(formCtrl) }
    dispatchEvent(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${form}`, payload)
}

function forwardResetFormEvent(form, formRef) {
    const payload = { formRef }
    dispatchEvent(`${REACT_FORMCTRL.EVENTS.FORM_RESETED}#${form}`, payload)
}

function forwardFieldChangedEvent(form, field, fieldCtrl, eventType) {
    const payload = { form, field, fieldCtrl: copyFieldCtrl(fieldCtrl), eventType }
    dispatchEvent(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${field}`, payload)
}

function forwardFormChangedEvent(form, formCtrl) {
    const payload = { form, formCtrl: copyFormCtrl(formCtrl) }
    dispatchEvent(`${REACT_FORMCTRL.EVENTS.FORM_CHANGED}#${form}`, payload)
}

export function formProviderEffects(state, action) {
    const type = action.type
    const payload = action.payload
    const EVENTS = REACT_FORMCTRL.EVENTS
    const formName = payload.form
    const fieldName = payload.field
    const eventType = payload.eventType
    const formCtrl = state.forms[formName]
    const fieldCtrl = fieldName && formCtrl ? formCtrl.fields[fieldName] : null
    switch (type) {
        case EVENTS.FIELD_BLURRED:
        case EVENTS.FIELD_CHANGED:
            forwardFieldChangedEvent(formName, fieldName, fieldCtrl, eventType)
            forwardFormChangedEvent(formName, formCtrl)
            break
        case EVENTS.REGISTER_FIELD:
            forwardFieldChangedEvent(formName, fieldName, fieldCtrl, 'registerField')
            forwardFormChangedEvent(formName, formCtrl)
            break
        case EVENTS.FIELD_PROPS_CHANGED:
            forwardFieldChangedEvent(formName, fieldName, fieldCtrl, 'propsChanged')
            forwardFormChangedEvent(formName, formCtrl)
            break
        case EVENTS.FORM_SUBMITED:
            forwardSubmitFormEvent(formName, formCtrl.values, formCtrl, payload.formRef)
            break
        case EVENTS.FORM_RESETED:
            Object.keys(formCtrl.fields).forEach(_fieldName => {
                const _field = formCtrl.fields[_fieldName]
                forwardFieldChangedEvent(formName, _fieldName, _field, eventType)
            })
            forwardResetFormEvent(formName, payload.formRef)
            forwardFormChangedEvent(formName, formCtrl)
            break
        case EVENTS.REGISTER_FORM:
        case EVENTS.UNREGISTER_FORM:
        case EVENTS.UNREGISTER_FIELD:
        default:
            break
    }
}