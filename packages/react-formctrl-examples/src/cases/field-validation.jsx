import React from 'react'

import {Form, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'
import {Json} from '../case'

function Input({label, name, value, onChange, onBlur, ctrl}) {
    return (
        <Json title="Field controller" json={ctrl}>
            <div className="form-group">
                <label htmlFor={name}>{label}:</label>
                <input className="form-control" name={name} value={value} onChange={onChange} onBlur={onBlur}></input>
            </div>
        </Json> 
    )
}

export function FieldValidationForm(props) {
    const formName = "fieldValidation"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Field validation", values)
    return (
        <div>
            <h3>Field validation form</h3>
            <p>There is a example of the field validation usage, the "Field" component injects into it's children a property named "ctrl".</p>
            <div>
                <Form name={formName} onSubmit={onSubmit}>
                    <Field form={formName} name="name" required>
                        <Input label="Name (required)"></Input>
                    </Field>
                    <Field form={formName} name="email" type="email" required>
                        <Input label="E-mail (email and required)"></Input>
                    </Field>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}