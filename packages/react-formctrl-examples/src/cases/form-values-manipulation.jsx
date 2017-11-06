import React from 'react'

import { Form, controlledField, controlledForm } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'

let InputField = ({ label, name, value, onChange, onBlur, ctrl: { valid, invalid, touched, errors } }) => {
    const getClassName = () => {
        if (valid) return 'is-valid'
        if (touched && invalid) return 'is-invalid'
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <input className={`form-control ${getClassName()}`} name={name} value={value} onChange={onChange} onBlur={onBlur}></input>
            {invalid && touched && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}
InputField = controlledField()(InputField)

let SampleForm = ({ form, formCtrl, onSubmit }) => {
    const setRandomAge = () => formCtrl.setFieldValue('age', `${parseInt(Math.random() * 100)}`)
    return (
        <Form name={form} onSubmit={onSubmit}>
            <InputField label="Name (required)" form={form} name="name" required />
            <InputField label="E-mail (email and required)" form={form} name="email" type="email" required />
            <InputField label="Age (number and required)" form={form} name="age" type="number" required />

            <div>
                <button className="btn btn-primary" disabled={formCtrl.invalid} type="submit">Submit</button>
                <button className="btn btn-default" disabled={formCtrl.unchanged} type="reset">Reset</button>
                <button className="btn btn-secondary" onClick={setRandomAge} type="button">Set random age</button>
            </div>
        </Form>
    )
}
SampleForm = controlledForm()(SampleForm)

export function FormValuesManipulationExample(props) {
    const formName = "valuesManipulationExampleForm"
    const handleSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Form controller example", values)
    return (
        <div>
            <h3>Form values manipulation:</h3>
            <p>This is a more complex example of form controller manipulation to programatically change state. Be careful with setValue method, calling it directly on component update phase may result on stack overflow error!</p>
            <div>
                <SampleForm form={formName} onSubmit={handleSubmit}></SampleForm>
            </div>
        </div>
    )
}