import React from 'react'
import { Form, controlledField, controlledForm } from 'react-formctrl'
import { SubmitValuesPopup } from '../components/submit-values'

let Input = ({ label, type, ctrl, name, onChange, onBlur, value, required }) => {
    const { valid, invalid, touched, errors } = ctrl
    const getClassName = () => {
        if (valid) return 'is-valid'
        if (touched && invalid) return 'is-invalid'
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
Input = controlledField()(Input)

let PeopleForm = ({ form = 'people', formCtrl, title, onSubmit }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h4>{title}</h4>
            </div>
            <div className="card-body">
                <Form className="form" name={form} onSubmit={onSubmit}>
                    <Input label="First name" form={form} name="firstName" className="field" required minLength={2} />
                    <Input label="Last name" form={form} name="lastName" className="field" required minLength={2} />
                    <Input label="E-mail" form={form} name="email" className="field" type="email" required />
                    <div>
                        <button className="btn btn-primary" disabled={formCtrl.invalid || formCtrl.unchanged} type="submit">Submit</button>
                        &nbsp;
                        <button className="btn btn-default" type="reset" disabled={formCtrl.unchanged}>Reset</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
PeopleForm = controlledForm()(PeopleForm)

export function SynchronizedForms(props) {

    const makeSubmitEvent = name => {
        return values => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent(name, values)
    }

    return (
        <div>
            <h3>Synchronized forms</h3>
            <p>If there is two instances of forms with the same name, they will be synchronized!</p>
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <PeopleForm title="Form 1" form="syncForm" onSubmit={makeSubmitEvent('Sync form 1')} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <PeopleForm title="Form 2" form="syncForm" onSubmit={makeSubmitEvent('Sync form 2')} />
                </div>
            </div>
        </div>
    )
}