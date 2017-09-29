import React from 'react'

import {Form, Field, FormControl} from 'react-formctrl'
import {SubmitValuesPopup} from '../components/submit-values'
import {Json} from '../components/case'

function Input({label, name, value, onChange, onBlur, ctrl: {valid, invalid, dirty, errors}}) {
    const getClassName = () => {
        if(valid) return 'is-valid'
        if(dirty && invalid) return 'is-invalid'
    }
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <input className={`form-control ${getClassName()}`} name={name} value={value} onChange={onChange} onBlur={onBlur}></input>
            {invalid && dirty && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}

function FormControlDisplay(props) {
    return (
        <Json title="Form controller" maxHeight={300} json={{formCtrl: props.formCtrl}}>{props.children}</Json>
    )
}

export function FormControlExample(props) {
    const formName = "fieldValidation"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Form controller example", values)
    return (
        <div>
            <h3>Form controller:</h3>
            <p>This is an example of how to handle the Form controller state to block buttons.</p>
            <div>
                <FormControl form={formName}>
                    <FormControlDisplay>
                        <Form name={formName} onSubmit={onSubmit}>
                            <div>
                                <Field form={formName} name="name" required>
                                    <Input label="Name (required)"></Input>
                                </Field>
                                <Field form={formName} name="email" type="email" required>
                                    <Input label="E-mail (email and required)"></Input>
                                </Field>
                                <div>
                                    <FormControl form={formName} inject={ctrl => ({disabled: ctrl.invalid})}>
                                        <button className="btn btn-primary" type="submit">Submit</button>
                                    </FormControl>
                                    <FormControl form={formName} inject={ctrl => ({disabled: ctrl.unchanged})}>
                                        <button className="btn btn-default" type="reset">Reset</button>
                                    </FormControl>
                                </div>
                            </div>
                        </Form>     
                    </FormControlDisplay>
                </FormControl>
            </div>
        </div>
    )
}