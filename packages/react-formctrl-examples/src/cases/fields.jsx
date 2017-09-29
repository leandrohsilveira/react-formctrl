import React from 'react'

import {Form, Field, FormControl} from 'react-formctrl'

import {SubmitValuesPopup} from '../components/submit-values'

const getInputClasses = ({valid, dirty, invalid}) => {
    if(valid) return 'is-valid'
    if(dirty && invalid) return 'is-invalid'
}

function FormGroup({name, label, children, ctrl: {invalid, dirty, errors}}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {children}
            {dirty && invalid && errors.map(error => (
                <div className="invalid-feedback" key={error.key}>{error.key}</div>
            ))}
        </div>
    )
}

function Input({name, label, type, onChange, onBlur, value, ctrl}) {
    return (
        <FormGroup name={name} label={label} ctrl={ctrl}>
            <input type={type} id={name} name={name} placeholder={label} className={`form-control ${getInputClasses(ctrl)}`} onChange={onChange} onBlur={onBlur} value={value}></input>
        </FormGroup>
    )
}

function InputFile({name, label, multiple = false, accept, onChange, ctrl}) {
    return (
        <FormGroup name={name} label={label} ctrl={ctrl}>
            <input type="file" id={name} name={name} accept={accept} placeholder={label} className={`form-control ${getInputClasses(ctrl)}`} multiple={multiple} onChange={onChange}></input>
        </FormGroup>
    )
}


function Select({name, label, onChange, onBlur, value, ctrl, children}) {
    
    return (
        <FormGroup name={name} label={label} ctrl={ctrl}>
            <select id={name} name={name} className={`form-control ${getInputClasses(ctrl)}`} onChange={onChange} onBlur={onBlur} value={value}>
                <option disabled={true} hidden={true} value=''>{label}</option>
                {children}
            </select>
        </FormGroup>
    )
}

function Radio({name, label, onChange, onBlur, value, groupValue}) {
    const checked = value === groupValue
    return (
        <div className="form-check">
            <label className="form-check-label" htmlFor={name}>
                <input type="radio" id={name} name={name} checked={checked} className='form-check-input' onChange={onChange} onBlur={onBlur} value={groupValue}></input>
                {label}
            </label>
        </div>
    )
}

function FieldsForm({onSubmit, formCtrl: {formName, invalid, unchanged}}) {
    return (
        <Form name={formName} onSubmit={onSubmit}>
            <Field form={formName} name="fieldText" required>
                <Input label="Field text"></Input>
            </Field>
            <Field form={formName} name="fieldNumberFloat" type="number" required min={0} max={100}>
                <Input label="Field number (float, min 0, max 100)"></Input>
            </Field>
            <Field form={formName} name="fieldNumberInteger" type="number" integer required>
                <Input label="Field number (integer)"></Input>
            </Field>
            <Field form={formName} name="fieldEmail" type="email" required>
                <Input label="Field e-mail"></Input>
            </Field>
            <Field form={formName} name="fieldFile" type="file" accept="image/png" maxSize={50000} required>
                <InputFile label="Field file (max size 50 kb)"></InputFile>
            </Field>
            <Field form={formName} name="fieldFileMultiple" type="file" accept="image/*" extensions={['png', 'jpg', 'jpeg']} required>
                <InputFile label="Field file (multiple)" multiple></InputFile>
            </Field>
            <Field form={formName} name="fieldPassword" type="password" minLength="8" required>
                <Input label="Field password"></Input>
            </Field>
            <Field form={formName} name="fieldPasswordMatch" type="password" minLength="8" match="fieldPassword" required>
                <Input label="Field password (match)"></Input>
            </Field>
            <Field form={formName} name="fieldSelect" required>
                <Select label="Field select">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                </Select>
            </Field>
            <div className="card">
                <div className="card-header">
                    <h5>Radio fields</h5>
                </div>
                <div className="card-body">
                    <Field form={formName} name="radioFields" required>
                        <Radio label="Radio field 1" groupValue="radioField1"></Radio>
                    </Field>
                    <Field form={formName} name="radioFields" required>
                        <Radio label="Radio field 2" groupValue="radioField2"></Radio>
                    </Field>
                    <Field form={formName} name="radioFields" required>
                        <Radio label="Radio field 3" groupValue="radioField3"></Radio>
                    </Field>
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            &nbsp;
            <button type="reset" className="btn btn-default" disabled={unchanged}>Reset</button>
        </Form>
    )
}

export function FieldsExample() {
    const handleSubmit = (values, formCtrl) => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Fields usage form", values, formCtrl.files)
    return (
        <div>
            <h3>Fields usage</h3>
            <FormControl form="fieldsUsageForm">
                <FieldsForm onSubmit={handleSubmit} />
            </FormControl>
        </div>
    )
}