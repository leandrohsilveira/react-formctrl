import React from 'react'

import {Form, Field, FormControl} from '../../'
import {SubmitValuesPopup} from '../submit-values'

function Input({label, name, value, onChange, onBlur, ctrl: {invalid, errors}}) {
    return (
        <div>
            <label htmlFor={name}>{label}:</label>
            <div>
                <input name={name} value={value} onChange={onChange} onBlur={onBlur} />
            </div>
            {invalid && (
                <div>
                    <ul>
                        {errors.map(error => (
                            <span>{error}</span>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function FormControlDisplay(props) {
    return (
        <div style={{whiteSpace: 'pre'}}>
            Form controller: {JSON.stringify(props, null, 4)}
        </div>
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
                        <Input label="Name (required)" />
                    </Field>
                    <Field form={formName} name="email" type="email" required>
                        <Input label="E-mail (email and required)" />
                    </Field>
                    <div>
                        <FormControl form={formName} transformProps={ctrl => ({disabled: ctrl.invalid})}>
                            <button type="submit">Submit</button>
                        </FormControl>
                        <FormControl form={formName} transformProps={ctrl => ({disabled: ctrl.unchanged})}>
                            <button type="reset">Reset</button>
                        </FormControl>
                    </div>
                    <FormControl form={formName}>
                        <FormControlDisplay />
                    </FormControl>
                </Form>
            </div>
            <hr/>
        </div>
    )
}