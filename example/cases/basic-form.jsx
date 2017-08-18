import React from 'react'

import {Form, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'

function Input({name, value, onChange}) {
    return (
        <input name={name} value={value} onChange={onChange}></input>
    )
}

export function BasicForm(props) {
    const formName = "basic"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Basic", values)
    return (
        <div>
            <h3>Basic form</h3>
            <p>This is a basic example of Form usage</p>
            <div>
                <Form name={formName} onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="simple">Simple:</label>
                        <div>
                            <Field form={formName} name="simple">
                                <Input></Input>
                            </Field>
                        </div>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}