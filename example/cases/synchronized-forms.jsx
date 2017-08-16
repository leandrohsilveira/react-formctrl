import React from 'react'
import {Form, FormControl, Field} from '../../'
import {SubmitValuesPopup} from '../submit-values'

function FieldWrapper({label, className = 'field', type, ctrl, name, onChange, onBlur, value, required}) {
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
                        onBlur={onBlur} />
            </div>

            {ctrl.invalid && ctrl.touched && (
                <div className="errors">
                    <ul>
                        {ctrl.errors.map(error => (
                            <li key={error}>{error}</li>
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
                        <FieldWrapper label="First name"></FieldWrapper>
                    </Field>
                </li>
                <li className="field-list-item">
                    <Field form={formName} name="lastName" className="field" required minLength={2}>
                        <FieldWrapper label="Last name"></FieldWrapper>
                    </Field>
                </li>
                <li className="field-list-item">
                    <Field form={formName} name="email" className="field" type="email" required>
                        <FieldWrapper label="E-mail"></FieldWrapper>
                    </Field>
                </li>
            </ul>
            <div>
                <FormControl form={formName} transformProps={formCtrl => ({disabled: formCtrl.invalid || formCtrl.unchanged})}>
                    <button type="submit">Submit</button>
                </FormControl>
                &nbsp;
                <FormControl form={formName} transformProps={formCtrl => ({disabled: formCtrl.unchanged})}>
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
                <PeopleForm formName="syncForm" onSubmit={makeSubmitEvent('Sync form 1')} />
                <h4>Form 2</h4>
                <PeopleForm formName="syncForm" onSubmit={makeSubmitEvent('Sync form 2')} />
            </div>
            <hr/>
        </div>
    )
}