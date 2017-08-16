import React from 'react'
import ReactDOM from 'react-dom'

import {FormProvider, Form, FormControl, Field} from '../'

export function FieldWrapper({label, className = 'field', type, ctrl, name, onChange, onBlur, value, required}) {
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

export function ExampleForm({formName = 'basic', onSubmit}) {
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

export function App(props) {
    return (
        <FormProvider>
            <div>
                <h1>ReactJS controlled forms</h1>
                <hr/>
                <br/><br/>
                <p>react-formctrl is a lightweight forms controller library for ReactJS inspired by Angular forms and Redux forms.</p>
                <h3>Basic form</h3>
                <p>This is a basic example of Form usage</p>
                <div>
                    <ExampleForm onSubmit={values => console.log('Basic form submit event', values)} />
                </div>
                <hr/>
                <h3>Synchronized forms</h3>
                <p>If there is two instances of forms with the same name, they will be synchronized!</p>
                <div>
                    <h4>Form 1</h4>
                    <ExampleForm formName="syncedForms" onSubmit={values => console.log('Synchronized form 1 submit event', values)} />
                    <h4>Form 2</h4>
                    <ExampleForm formName="syncedForms" onSubmit={values => console.log('Synchronized form 2 submit event', values)} />
                </div>
            </div>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))