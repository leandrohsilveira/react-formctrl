import React from 'react'

import { Form, Field, FormControl } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'

function Input({ label, name, value, onChange, onBlur, ctrl: { valid, invalid, touched, errors } }) {
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

function InputField({ label, formName, fieldName, type = 'text', required, pattern, className }) {
    return (
        <Field form={formName} name={fieldName} type={type} required={required} pattern={pattern} className={className}>
            <Input label={label}></Input>
        </Field>
    )
}

function SampleForm({ formCtrl, onSubmit }) {
    const formName = formCtrl.formName
    const setRandomAge = () => formCtrl.setFieldValue('age', `${parseInt(Math.random() * 100)}`)
    return (
        <Form name={formName} onSubmit={onSubmit}>
            <InputField label="Name (required)" formName={formName} fieldName="name" required></InputField>
            <InputField label="E-mail (email and required)" formName={formName} fieldName="email" type="email" required></InputField>
            <InputField label="Age (number and required)" formName={formName} fieldName="age" type="number" required></InputField>

            <div>
                <button className="btn btn-primary" disabled={formCtrl.invalid} type="submit">Submit</button>
                <button className="btn btn-default" disabled={formCtrl.unchanged} type="reset">Reset</button>
                <button className="btn btn-secondary" onClick={setRandomAge} type="button">Set random age</button>
            </div>
        </Form>
    )
}

export function FormValuesManipulationExample(props) {
    const formName = "valuesManipulationExampleForm"
    const handleSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Form controller example", values)
    return (
        <div>
            <h3>Form values manipulation:</h3>
            <p>This is a more complex example of form controller manipulation to programatically change state. Be careful with setValue method, calling it directly on component update phase may result on stack overflow error!</p>
            <div>
                <FormControl form={formName}>
                    <SampleForm onSubmit={handleSubmit}></SampleForm>
                </FormControl>
            </div>
        </div>
    )
}