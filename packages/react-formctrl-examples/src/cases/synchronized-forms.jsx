import React from 'react'
import {Form, FormControl, Field} from 'react-formctrl'
import {SubmitValuesPopup} from '../submit-values'

function Input({label, type, ctrl, name, onChange, onBlur, value, required}) {
    const {valid, invalid, touched, errors} = ctrl
    const getClassName = () => {
        if(valid) return 'is-valid'
        if(touched && invalid) return 'is-invalid'
    }
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} 
                    className={`form-control ${getClassName()}`}
                    id={name} 
                    name={name} 
                    required={required} 
                    value={value} 
                    onChange={onChange}
                    onBlur={onBlur}>
            </input>

            {invalid && touched && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}

function PeopleForm({formName = 'people', title, onSubmit}) {
    return (
        <div className="card">
            <div className="card-header">
                <h4>{title}</h4>
            </div>
            <div className="card-body">
                <Form className="form" name={formName} onSubmit={onSubmit}>
                    <Field form={formName} name="firstName" className="field" required minLength={2}>
                        <Input label="First name"></Input>
                    </Field>
                    <Field form={formName} name="lastName" className="field" required minLength={2}>
                        <Input label="Last name"></Input>
                    </Field>
                    <Field form={formName} name="email" className="field" type="email" required>
                        <Input label="E-mail"></Input>
                    </Field>
                    <div>
                        <FormControl form={formName} inject={formCtrl => ({disabled: formCtrl.invalid || formCtrl.unchanged})}>
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </FormControl>
                        &nbsp;
                        <FormControl form={formName} inject={formCtrl => ({disabled: formCtrl.unchanged})}>
                            <button className="btn btn-default" type="reset">Reset</button>
                        </FormControl>
                    </div>
                </Form>
            </div>
        </div>
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
            <div className="row">
                <div className="col">
                    <PeopleForm title="Form 1" formName="syncForm" onSubmit={makeSubmitEvent('Sync form 1')}></PeopleForm>
                </div>
                <div className="col">
                    <PeopleForm title="Form 2" formName="syncForm" onSubmit={makeSubmitEvent('Sync form 2')}></PeopleForm>
                </div>
            </div>
        </div>
    )
}