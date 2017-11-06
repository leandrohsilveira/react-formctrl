import React from 'react'

import { Form, controlledField } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'

let Input = ({ name, value, onChange }) => {
    return (
        <input
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
        />
    )
}
Input = controlledField()(Input)

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
                        <Input form={formName} name="simple" />
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}