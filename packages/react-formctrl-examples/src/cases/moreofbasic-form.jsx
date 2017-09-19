import React from 'react'

import {Form, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'

function Input({label, name, value, onChange}) {
    return (
        <div>
            <label htmlFor={name}>{label}:</label>
            <div>
                <input name={name} value={value} onChange={onChange}></input>
            </div>
        </div>
    )
}

export function MoreOfBasicForm(props) {
    const formName = "moreofbasic"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("More of basics", values)
    return (
        <div>
            <h3>More of basic form</h3>
            <p>This is one more basic example of Form usage, where is possible to provide initial values, and the form reset button will reset to its initial values.</p>
            <div>
                <Form name={formName} onSubmit={onSubmit}>
                    <Field form={formName} name="simple">
                        <Input label="Simple" ></Input>
                    </Field>
                    <Field form={formName} name="withInitialValue" initialValue="Initial value">
                        <Input label="With initial value" ></Input>
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