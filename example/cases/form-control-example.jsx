import React from 'react'

import {Form, Field, FormControl} from '../../'
import {SubmitValuesPopup} from '../submit-values'
import {Json} from '../case'

function Input({label, name, value, onChange, onBlur, ctrl: {invalid, errors}}) {
    return (
        <div>
            <label htmlFor={name}>{label}:</label>
            <div>
                <input name={name} value={value} onChange={onChange} onBlur={onBlur}></input>
            </div>
            {invalid && (
                <div>
                    <ul>
                        {errors.map(error => (
                            <span key={error}>{error}</span>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function FormControlDisplay(props) {
    return (
        <Json title="Form controller" json={props}></Json>
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
                <Form name={formName} onSubmit={onSubmit}>
                    <Field form={formName} name="name" required>
                        <Input label="Name (required)"></Input>
                    </Field>
                    <Field form={formName} name="email" type="email" required>
                        <Input label="E-mail (email and required)"></Input>
                    </Field>
                    <div>
                        <FormControl form={formName} transformProps={ctrl => ({disabled: ctrl.invalid})}>
                            <button type="submit">Submit</button>
                        </FormControl>
                        <FormControl form={formName} transformProps={ctrl => ({disabled: ctrl.unchanged})}>
                            <button type="reset">Reset</button>
                        </FormControl>
                    </div>
                    <br/>
                    <FormControl form={formName}>
                        <FormControlDisplay></FormControlDisplay>
                    </FormControl>
                </Form>
            </div>
        </div>
    )
}