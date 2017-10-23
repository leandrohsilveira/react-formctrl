import {REACT_FORMCTRL} from './provider.actions'
import {copyFieldCtrl, copyFormCtrl} from './provider.utils'

function forwardEvent(eventName, detail) {
    const payload = {detail}
    const event = new CustomEvent(eventName, payload)
    document.dispatchEvent(event)
}

function forwardSubmitFormEvent(state, payload) {
    const formName = payload.form
    const formRef = payload.formRef
    const formCtrl = state.forms[formName]
    if(formCtrl) {
        const values = formCtrl.values
        forwardEvent(`${REACT_FORMCTRL.EVENTS.FORM_SUBMITED}#${formName}`, {values, formRef, formCtrl: copyFormCtrl(formCtrl)})
    }
}

function forwardFieldChangedEvent(state, payload) {
    const form = payload.form
    const field = payload.field
    const formCtrl = state.forms[form]
    if(formCtrl) {
        const fieldCtrl = formCtrl.fields[field]
        forwardEvent(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${field}`, {form, field, fieldCtrl: copyFieldCtrl(fieldCtrl)})
    }
}

function forwardFormChangedEvent(state, payload) {
    const form = payload.form
    const formCtrl = state.forms[form]
    if(formCtrl) {
        forwardEvent(`${REACT_FORMCTRL.EVENTS.FORM_CHANGED}#${form}`, {form, formCtrl: copyFormCtrl(formCtrl)})
    }
}

function forwardFormResetEvent(state, payload) {
    const form = payload.form
    const formCtrl = state.forms[form]
    if(formCtrl) {
        Object.keys(formCtrl.fields).forEach(field => {
            const fieldCtrl = formCtrl.fields[field]
            forwardEvent(`${REACT_FORMCTRL.EVENTS.FIELD_CHANGED}#${form}#${field}`, {form, field, fieldCtrl: copyFieldCtrl(fieldCtrl)})
        })
    }
}

export function formProviderEffects(state, action) {
    const EVENTS = REACT_FORMCTRL.EVENTS
    const type = action.type
    const payload = action.payload
    switch(type) {
        case EVENTS.FIELD_BLURRED:
        case EVENTS.REGISTER_FIELD:
        case EVENTS.FIELD_CHANGED:
        case EVENTS.FIELD_PROPS_CHANGED:
            forwardFieldChangedEvent(state, payload)
            forwardFormChangedEvent(state, payload)
            break
            
        case EVENTS.FORM_SUBMITED:
            forwardSubmitFormEvent(state, payload)
            break
        case EVENTS.FORM_RESETED:
            forwardFormResetEvent(state, payload)
            forwardFormChangedEvent(state, payload)
            break
        case EVENTS.REGISTER_FORM:
        case EVENTS.UNREGISTER_FORM:
        case EVENTS.UNREGISTER_FIELD:
        default:
            break
    }
}