import React from 'react'
import {Form, FormControl, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'

function Input({label, className = 'field', type, ctrl, name, onChange, onBlur, value, required}) {
    return (
        <div className={className}>
            <label htmlFor={name}>{label}</label>
            <div>
                <input type={type} 
                        id={name} 
                        name={name} 
                        required={required} 
                        value={value} 
                        onChange={onChange}
                        onBlur={onBlur}>
                </input>
            </div>

            {ctrl.invalid && ctrl.touched && (
                <div className="errors">
                    <ul>
                        {ctrl.errors.map(error => (
                            <li key={error.key}>{error.key}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function PeopleForm({formName = 'people', onSubmit}) {
    return (
        <Form className="form" name={formName} onSubmit={onSubmit}>
            <ul className="field-list">
                <li className="field-list-item">
                    <Field form={formName} name="firstName" className="field" required minLength={2}>
                        <Input label="First name"></Input>
                    </Field>
                </li>
                <li className="field-list-item">
                    <Field form={formName} name="lastName" className="field" required minLength={2}>
                        <Input label="Last name"></Input>
                    </Field>
                </li>
                <li className="field-list-item">
                    <Field form={formName} name="email" className="field" type="email" required>
                        <Input label="E-mail"></Input>
                    </Field>
                </li>
            </ul>
            <div>
                <FormControl form={formName} inject={formCtrl => ({disabled: formCtrl.invalid || formCtrl.unchanged})}>
                    <button type="submit">Submit</button>
                </FormControl>
                &nbsp;
                <FormControl form={formName} inject={formCtrl => ({disabled: formCtrl.unchanged})}>
                    <button type="reset">Reset</button>
                </FormControl>
            </div>
        </Form>
    )
}

export function SynchronizedForms(props) {

    const makeSubmitEvent = name => {
        return values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent(name, values)
    }

    return (
        <div>
            <h3>Synchronized forms</h3>
            <p>If there is two instances of forms with the same name, they will be synchronized!</p>
            <div>
                <h4>Form 1</h4>
                <PeopleForm formName="syncForm" onSubmit={makeSubmitEvent('Sync form 1')}></PeopleForm>
                <h4>Form 2</h4>
                <PeopleForm formName="syncForm" onSubmit={makeSubmitEvent('Sync form 2')}></PeopleForm>
            </div>
        </div>
    )
}