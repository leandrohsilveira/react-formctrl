import React from 'react'

import {Form, Field} from '../../'
import {SubmitValuesPopup} from '../submit-values'

function Input({label, name, value, onChange, onBlur, ctrl}) {
    return (
        <div>
            <label htmlFor={name}>{label}:</label>
            <div>
                <input name={name} value={value} onChange={onChange} onBlur={onBlur} />
            </div>
            <div style={{whiteSpace: 'pre'}}>
                Field controller: {JSON.stringify(ctrl, null, 4)}
            </div>
        </div>
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
                        <Input label="Name (required)" />
                    </Field>
                    <Field form={formName} name="email" type="email" required>
                        <Input label="E-mail (email and required)" />
                    </Field>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                    </div>
                </Form>
            </div>
            <hr/>
        </div>
    )
}