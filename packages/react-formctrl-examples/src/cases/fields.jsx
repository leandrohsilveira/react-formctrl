import React from 'react'

import { Form, FormControl, controlledField, controlledForm } from 'react-formctrl'

import { SubmitValuesPopup } from '../components/submit-values'

const getInputClasses = ({ valid, dirty, invalid }) => {
    if (valid) return 'is-valid'
    if (dirty && invalid) return 'is-invalid'
    return '';
}

function InputGroup({ name, label, children, after, ctrl }) {
    return (
        <FormGroup name={name} label={label} ctrl={ctrl}>
            <div className={`input-group ${getInputClasses(ctrl)}`}>
                {children}
                {!!after && (
                    <div className="input-group-append">
                        {after}
                    </div>
                )}
            </div>
        </FormGroup>
    )
}

function FormGroup({ name, label, children, ctrl: { invalid, dirty, errors } }) {
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
let Input = ({ name, label, type, after, onChange, onBlur, value, ctrl }) => {

    const inp = (
        <input 
            type={type} 
            name={name} 
            placeholder={label} 
            className={`form-control ${getInputClasses(ctrl)}`} 
            onChange={onChange} 
            onBlur={onBlur} 
            value={value} 
        />
    )

    if(!!after) {
        return (
            <InputGroup name={name} label={label} ctrl={ctrl} after={after}>
                {inp}
            </InputGroup>
        )
    } else {
        return (
            <FormGroup name={name} label={label} ctrl={ctrl}>
                {inp}
            </FormGroup>
        )
    }

}

let InputFile = ({ name, label, multiple = false, accept, onChange, ctrl }) => (
    <FormGroup name={name} label={label} ctrl={ctrl}>
        <input type="file" name={name} accept={accept} placeholder={label} className={`form-control ${getInputClasses(ctrl)}`} multiple={multiple} onChange={onChange}></input>
    </FormGroup>
)

let Select = ({ name, label, onChange, onBlur, value, ctrl, children }) => (
    <FormGroup name={name} label={label} ctrl={ctrl}>
        <select name={name} className={`form-control ${getInputClasses(ctrl)}`} onChange={onChange} onBlur={onBlur} value={value}>
            <option disabled={true} hidden={true} value=''>{label}</option>
            {children}
        </select>
    </FormGroup>
)

let Radio = ({ name, label, onChange, onBlur, value, groupValue }) => {
    const checked = value === groupValue
    return (
        <div className="form-check">
            <label className="form-check-label" htmlFor={name}>
                <input type="radio" name={name} checked={checked} className='form-check-input' onChange={onChange} onBlur={onBlur} value={groupValue}></input>
                {label}
            </label>
        </div>
    )
}

Input = controlledField()(Input)
InputFile = controlledField()(InputFile)
Select = controlledField()(Select)
Radio = controlledField()(Radio)

class InputPassword extends React.Component {

    state = {
        fieldType: 'password'
    }

    switchField() {
        this.setState(state => {
            if(state.fieldType === 'password') {
                return {fieldType: 'text'}   
            } else {
                return {fieldType: 'password'}
            }
        })
    }

    render() {
        const {form, name, required, minLength, match, label} = this.props
        const {fieldType} = this.state
        const iconClass = fieldType === 'password' ? 'eye' : 'eye-slash'
        const showHidePasswordButton = (
            <button 
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.switchField.bind(this)}
            >
                <i className={`fa fa-${iconClass}`} />
            </button>
        )

        return (
            <div>
                <Input 
                    label={label}
                    form={form}
                    name={name}
                    type={fieldType}
                    minLength={minLength}
                    match={match}
                    required={required}
                    after={showHidePasswordButton}
                />
            </div>
        )

    }
}

let FieldsForm = ({ onSubmit, formCtrl: { formName, invalid, unchanged } }) => (
    <Form name={formName} onSubmit={onSubmit}>

        <Input
            label="Field text"
            form={formName}
            name="fieldText"
            required
        />
        <Input
            label="Field text (extra event handlers)"
            form={formName}
            name="fieldTextExtraHandlers"
            onChange={ctrl => console.log(`Field.${ctrl.props.name}.onChange`)}
            onBlur={ctrl => console.log(`Field.${ctrl.props.name}.onBlur`)}
            onReset={ctrl => console.log(`Field.${ctrl.props.name}.onReset`)}
            required
        />
        <Input
            label="Field number (float, min 0, max 100)"
            form={formName}
            name="fieldNumberFloat"
            type="number"
            required
            min={0}
            max={100}
        />
        <Input
            label="Field number (integer)"
            form={formName}
            name="fieldNumberInteger"
            type="number"
            integer
            required
        />
        <Input
            label="Field e-mail"
            form={formName}
            name="fieldEmail"
            type="email"
            required
        />
        <Input 
            label="Date field"
            form={formName}
            name="fieldDate"
            type="date"
            required
        />
        <Input 
            label="Date field (with initial Date type value)"
            form={formName}
            name="fieldDateWithDateInitialValue"
            type="date"
            initialValue={new Date()}
            required
        />
        <Input 
            label="Date field (with initial Date string value)"
            form={formName}
            name="fieldDateWithStringInitialValue"
            type="date"
            initialValue={'2018-02-02'}
            required
        />
        <Input 
            label="Date field (with initial Date number value)"
            form={formName}
            name="fieldDateWithNumberInitialValue"
            type="date"
            initialValue={new Date().getTime()}
            required
        />

        <Input 
            label="Datetime field"
            form={formName}
            name="fieldDateTime"
            type="datetime-local"
            required
        />
        <Input 
            label="Datetime field (with initial Date type value)"
            form={formName}
            name="fieldDateTimeWithDateInitialValue"
            type="datetime-local"
            initialValue={new Date()}
            required
        />
        <Input 
            label="Datetime field (with initial Date string value)"
            form={formName}
            name="fieldDateTimeWithStringInitialValue"
            type="datetime-local"
            initialValue={'2018-02-02T15:00'}
            required
        />
        <Input 
            label="Datetime field (with initial Date number value)"
            form={formName}
            name="fieldDateTimeWithNumberInitialValue"
            type="datetime-local"
            initialValue={new Date().getTime()}
            required
        />
        <InputFile
            label="Field file (max size 50 kb)"
            form={formName}
            name="fieldFile"
            type="file"
            accept="image/png"
            maxSize={50000}
            required
        />
        <InputFile
            label="Field file (multiple)"
            form={formName}
            name="fieldFileMultiple"
            type="file"
            accept="image/*"
            multiple
            extensions={['png', 'jpg', 'jpeg']}
            required
        />
        <InputPassword
            label="Field password"
            form={formName}
            name="fieldPassword"
            minLength="8"
            required
        />
        <InputPassword
            label="Field password (match)"
            form={formName}
            name="fieldPasswordMatch"
            minLength="8"
            match="fieldPassword"
            required
        />
        <Select label="Field select" form={formName} name="fieldSelect" required>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
            <option value="option4">Option 4</option>
        </Select>
        <div className="card">
            <div className="card-header">
                <h5>Radio fields</h5>
            </div>
            <div className="card-body">
                <Radio label="Radio field 1" groupValue="radioField1" form={formName} name="radioFields" required />
                <Radio label="Radio field 2" groupValue="radioField2" form={formName} name="radioFields" required />
                <Radio label="Radio field 3" groupValue="radioField3" form={formName} name="radioFields" required />
            </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        &nbsp;
        <button type="reset" className="btn btn-default" disabled={unchanged}>Reset</button>
    </Form>
)
FieldsForm = controlledForm()(FieldsForm)

export function FieldsExample() {
    const handleSubmit = (values, formCtrl) => SubmitValuesPopup.dispatchShowSubmitValuesPopupEvent("Fields usage form", values, formCtrl.files)
    return (
        <div>
            <h3>Fields usage</h3>
            <FieldsForm form="fieldsUsageForm" onSubmit={handleSubmit} />
        </div>
    )
}