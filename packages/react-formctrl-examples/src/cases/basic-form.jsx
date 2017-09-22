import React from 'react'

import {Form, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'

function Input({name, value, onChange}) {
    return (
        <input className="form-control" name={name} value={value} onChange={onChange}></input>
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
                    <div className="form-group">
                        <label htmlFor="simple">Simple:</label>
                        <Field form={formName} name="simple">
                            <Input></Input>
                        </Field>
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}