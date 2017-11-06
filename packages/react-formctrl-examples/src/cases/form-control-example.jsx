import React from 'react'

import { Form, controlledField, controlledForm } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'
import { Json } from '../components/case'

let Input = ({ label, name, value, onChange, onBlur, ctrl: { valid, invalid, dirty, errors } }) => {
    const getClassName = () => {
        if (valid) return 'is-valid'
        if (dirty && invalid) return 'is-invalid'
    }
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <input className={`form-control ${getClassName()}`} name={name} value={value} onChange={onChange} onBlur={onBlur} />
            {invalid && dirty && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}
Input = controlledField()(Input)

function FormControlDisplay(props) {
    return (
        <Json title="Form controller" maxHeight={300} json={{ formCtrl: props.formCtrl }}>{props.children}</Json>
    )
}

let FormControlExampleForm = ({ form, formCtrl, onSubmit }) => (
    <FormControlDisplay formCtrl={formCtrl}>
        <Form name={form} onSubmit={onSubmit}>
            <div>
                <Input label="Name (required)" form={form} name="name" required />
                <Input label="E-mail (email and required)" form={form} name="email" type="email" required />
                <div>
                    <button className="btn btn-primary" disabled={formCtrl.invalid} type="submit">Submit</button>
                    <button className="btn btn-default" disabled={formCtrl.unchanged} type="reset">Reset</button>
                </div>
            </div>
        </Form>
    </FormControlDisplay>
)
FormControlExampleForm = controlledForm()(FormControlExampleForm)

export function FormControlExample() {
    const handleSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Form controller example", values)
    return (
        <div>
            <h3>Form controller:</h3>
            <p>This is an example of how to handle the Form controller state to block buttons.</p>
            <div>
                <FormControlExampleForm form="fieldValidation" onSubmit={handleSubmit} />
            </div>
        </div>
    )
}