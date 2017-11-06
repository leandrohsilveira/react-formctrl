import React from 'react'

import { Form, controlledField } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'
import { Json } from '../components/case'

let Input = ({ label, name, value, onChange, onBlur, ctrl }) => {
    const { valid, invalid, dirty, errors } = ctrl

    const getClassName = () => {
        if (valid) return 'is-valid'
        if (dirty && invalid) return 'is-invalid'
    }
    return (
        <Json title="Field controller" json={ctrl}>
            <div className="form-group">
                <label htmlFor={name}>{label}:</label>
                <input className={`form-control ${getClassName()}`} name={name} value={value} onChange={onChange} onBlur={onBlur}></input>
                {invalid && dirty && errors.map(error => (
                    <div className="invalid-feedback" key={error.key}>{error.key}</div>
                ))}
            </div>
        </Json>
    )
}

Input = controlledField()(Input)

export function FieldValidationForm(props) {
    const formName = "fieldValidation"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Field validation", values)
    return (
        <div>
            <h3>Field validation form</h3>
            <p>There is a example of the field validation usage, the "Field" component injects into it's children a property named "ctrl".</p>
            <div>
                <Form name={formName} onSubmit={onSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <Input label="Name (required)" form={formName} name="name" required />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <Input label="E-mail (email and required)" form={formName} name="email" type="email" required />
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-default" type="reset">Reset</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}