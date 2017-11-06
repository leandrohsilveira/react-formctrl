import React from 'react'

import { FormProvider, Form, controlledForm, controlledField } from 'react-formctrl'

import { CustomValidator } from 'react-formctrl/lib/validator'

import { SubmitValuesPopup } from '../components/submit-values'

let Input = ({ name, label, type, onChange, onBlur, value, ctrl: { valid, invalid, dirty, errors } }) => {
    const getInputClasses = () => {
        if (valid) return 'is-valid'
        if (dirty && invalid) return 'is-invalid'
    }
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} id={name} name={name} className={`form-control ${getInputClasses()}`} onChange={onChange} onBlur={onBlur} value={value}></input>
            {invalid && dirty && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}
Input = controlledField()(Input)

let CustomValidatorForm = ({ onSubmit, formCtrl: { formName, invalid, unchanged } }) => {
    return (
        <Form name={formName} onSubmit={onSubmit}>
            <Input
                label="Username 1 (required, not admin)"
                form={formName}
                name="username1"
                validate={["noadmin"]}
                required
            />
            <Input
                label="Username 2 (required, not admin)"
                form={formName}
                name="username2"
                validate="noadmin"
                required
            />
            <button type="submit" className="btn btn-primary" disabled={invalid || unchanged}>Submit</button>
            &nbsp;
            <button type="reset" className="btn btn-default" disabled={unchanged}>Reset</button>
        </Form>
    )
}
CustomValidatorForm = controlledForm()(CustomValidatorForm)

export function CustomValidatorExample() {
    const handleSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Custom validator form", values)
    return (
        <div>
            <h3>Custom validators</h3>
            <p>There is a example of the custom field validation usage, the "Field" component can have a "validate" property to map a custom validation registered on "FieldProvider" component.</p>
            <CustomValidatorForm form="customValidatorExampleForm" onSubmit={handleSubmit}></CustomValidatorForm>
        </div>
    )
}

class NoAdminValidator extends CustomValidator {

    constructor() {
        super('noadmin') // This constructor parameter defines the error message key
    }

    validate(formCtrl, props, value, files) {
        return !/^admin$/i.test(value)
    }

}

function App() {
    const customValidators = [
        new NoAdminValidator()
    ]
    return (
        <FormProvider customValidators={customValidators}>
            <CustomValidatorExample></CustomValidatorExample>
        </FormProvider>
    )
}

