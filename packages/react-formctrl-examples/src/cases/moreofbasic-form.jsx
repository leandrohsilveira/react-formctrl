import React from 'react'

import { Form, controlledField } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'

let Input = ({ label, name, value, onChange }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}:</label>
            <div>
                <input className="form-control" name={name} value={value} onChange={onChange}></input>
            </div>
        </div>
    )
}
Input = controlledField()(Input)

export function MoreOfBasicForm(props) {
    const formName = "moreofbasic"
    const onSubmit = values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("More of basics", values)
    return (
        <div>
            <h3>More of basic form</h3>
            <p>This is one more basic example of Form usage, where is possible to provide initial values, and the form reset button will reset to its initial values.</p>
            <div>
                <Form name={formName} onSubmit={onSubmit}>
                    <Input label="Simple" form={formName} name="simple" />
                    <Input label="With initial value" form={formName} name="withInitialValue" initialValue="Initial value" />
                    <div>
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-default" type="reset">Reset</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}