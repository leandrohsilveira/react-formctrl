[![Build Status](https://travis-ci.org/leandrohsilveira/react-formctrl.svg?branch=master)](https://travis-ci.org/leandrohsilveira/react-formctrl) 
[![Coverage Status](https://coveralls.io/repos/github/leandrohsilveira/react-formctrl/badge.svg?branch=master)](https://coveralls.io/github/leandrohsilveira/react-formctrl?branch=master) 
[![Known Vulnerabilities](https://snyk.io/test/github/leandrohsilveira/react-formctrl/badge.svg)](https://snyk.io/test/github/leandrohsilveira/react-formctrl)

# React Form CTRL 
A lightweight React form library inspired by Angular's forms and Redux-Form.

Bundle size: 29.6 KB (5.9 KB gzipped) (09/29/2017, v1.2.0)

## Features

* No schema
* Declarative
* Extremely reusable forms
* Field level reusability
* Built-in and custom validators
* Controlled inputs
* With decorators

## 1. Quick start

`npm install --save react-formctrl`

### 1.1. Wrap all your application with:
```jsx
export function App(props) {
    return (
        <FormProvider>
            {'... your app ...'}
        </FormProvider>
    )
}
```

### 1.2. Create and decorate your field component:
```jsx
let InputField = ({label, placeholder, name, type, required, onChange, onBlur, value}) => {

    const getLabel = () => {
        return required ? `${label}*` : label
    }

    return (
        <div>
            <label for={name}>{getLabel()}</label>
            <input id={name} name={name} 
                type={type} 
                onChange={onChange} 
                onBlur={onBlur}
                placeholder={placeholder || label}
                value={value} 
            />
        </div>
    );
}
InputField = controlledField()(InputField)
```

Now, your field component will need two required props:
* **form**: the name of the form that the field is attached to;
* **name**: the name of the field;

And will have some optional properties too:
* **type**: The input field type.
* **required**: `true` if the input field is required.
* **pattern**: The regex to validate the field pattern.
* **integer**: `true` if when the Field type property is "number" and should validate to integer value.
* **match**: Another field name that the value of this field should match.
* **min**: The min number value of a field with type "number".
* **max**: The max number value of a field with type "number".
* **minLength**: The min string value length of a field.
* **maxLength**: The max string value length of a field.

The `controlledField` decorator will inject a `ctrl` property which can be used to access the field state:
* **valid/invalid**: The field validation state;
* **pristine/dirty**: The field modification state;
* **untouched/touched**: The field access state (changed on blur);
* **unchanged/changed**: The field change state (initial value comparison);
* **errors**: An array of the validation errors: (`[{key: 'email', params: {value: 'email@'}}]`);

The `controlledField` decorator automatically handles the `value`, `onChange` and `onBlur` properties, so you just need to bind them to a input.

### 1.3. Build and decorate your forms:
```jsx
let PersonForm = ({form, formCtrl, onSubmit, person = {}}) => (
    <Form name={form} onSubmit={onSubmit}>
        <div class="fieldset">
            <div class="fields-container">
                <InputField 
                    form={form} 
                    name="name" 
                    label="Name" 
                    initialValue={person.name} 
                    required 
                />
                <InputField 
                    form={form} 
                    name="email" 
                    type="email" 
                    label="E-mail" 
                    initialValue={person.email} 
                    required 
                />
            </div>
            <div class="buttons-container">
                <button type="submit" disabled={formCtrl.invalid || formCtrl.unchanged}>Save</button>
                <button type="reset" disabled={formCtrl.unchanged}>Reset</button>
            </div>
        </div>
    </Form>
)
PersonForm = controlledForm()(PersonForm)
```

Now, your field component will need a required props:
* **form**: the name of the form that the controller will be attached to;

The `controlledForm` decorator will inject a `formCtrl` property which can be used to access the form state:
* **valid/invalid**: The form's fields validation state;
* **pristine/dirty**: The form's fields modification state;
* **untouched/touched**: The form's fields access state (changed on blur);
* **unchanged/changed**: The form's fields change state (initial value comparison);
* **values**: The values of the form (`{[fieldName]: 'fieldValue'}`);
* **files**: the selected files of the form (`{[fieldName]: File[]}`);

If you need to programatically change a field's value, use: `formCtrl.setFieldValue('fieldName', 'newValue')`.
Just be careful about the phase that you trigger the change, because this will trigger the Form and related Field update phase. So, ensure the form component update effects don't triggers `setFieldValue` again infinitely.

### 1.4. Finally, use and reuse your forms!
```jsx
function CreatePersonRoute() {
    return <PersonForm form="createPersonForm" />
}

function EditPersonRoute() {
    const person = {
        name: 'Leandro Hinckel Silveira',
        email: 'leandro.hinckel@gmail.com'
    }
    return <PersonForm form="editPersonForm" person={person} />
}
```

## 2. Adding custom validation

### 2.1. Create a class that extends CustomValidator
```jsx
class NoStupidPassword extends CustomValidator {
    constructor() {
        super('stupidpass')
    }
    validate(formCtrl, props, value, files) {
        return !/^123456789$/i.test(value)
    }
}
```
The string parameter of `super` constructor determines the key name of the validator to use it later.

### 2.2 Declare it on FormProvider component
```jsx
function App() {
    return (
        <FormProvider validators={[new NoStupidPassword()]}>
            <UserForm form="userForm">
        </FormProvider>
    )
}
```

### 2.3 Then activate the validator
Use the validator's key name passed to the `super` constructor to activate the validation:
```jsx

let UserForm = ({form, formCtrlm onSubmit}) => (
    <Form name={form} onSubmit={onSubmit}>
        <InputField 
            form={form} 
            name="username" 
            label="Username" 
            required 
        />
        <InputField 
            form={form} 
            name="password" 
            type="password" 
            label="Password" 
            validate="stupidpass"
            required 
        />
        <InputField 
            form={form} 
            name="confirmPassword"
            type="password"
            label="Confirm password"
            match="password"
            validate="stupidpass"
            required 
        />
        <button type="submit" disabled={formCtrl.invalid || formCtrl.unchanged}>Save</button>
    </Form>
)
UserForm = controlledForm()(UserForm)
```

## 3. Reach field level reusability
The field level reusability means that even the specific forms fields can be reusable thanks to Form and Field decoupling.

### 3.1 Create form's part components
```jsx
function UserInformationsFields({form, user = {}}) {
    return (
        <div>
            <InputField 
                form={form} 
                name="name" 
                label="Full name" 
                initialValue={user.name} 
            />
            <InputField 
                form={form} 
                name="email" 
                type="email" 
                label="E-mail" 
                initialValue={user.email} 
            />
            <InputField 
                form={form} 
                name="confirmEmail" 
                type="email" 
                label="Confirm e-mail" 
                initialValue={user.email} 
                match="email"
            />
        </div>
    )
}
function UserCredentialsFields({form, user = {}}) {
    return (
        <div>
            <InputField 
                form={form} 
                name="username" 
                label="Username" 
                initialValue={user.username} 
                required
                minLength={6}
                maxLength={18}
            />
            <InputField 
                form={form} 
                name="password" 
                type="password" 
                label="Password" 
            />
            <InputField 
                form={form} 
                name="confirmPassword" 
                type="password" 
                label="Confirm password" 
                match="password"
            />
        </div>
    )
} 
```

### 3.2 Reuse them in different forms
```jsx
let QuickUserRegistrationForm = ({form, formCtrl, onSubmit}) => (
    <Form name={form} onSubmit={onSubmit}>
        <UserCredentialsFields form={form} />
        <button type="submit" disabled={formCtrl.invalid || formCtrl.unchanged}>Save</button>
    </Form>
)
let FullUserForm = ({form, formCtrl, onSubmit, user = {}}) => (
    <Form name={form} onSubmit={onSubmit}>
        <UserInformationsFields form={form} user={user} />
        <UserCredentialsFields form={form} user={user} />
        <button type="submit" disabled={formCtrl.invalid || formCtrl.unchanged}>Save</button>
    </Form>
)
QuickUserRegistrationForm = controlledForm(QuickUserRegistrationForm)
FullUserForm = controlledForm(FullUserForm)
```

# Components

## FormProvider

The component that controls all form values and events. There may only be one instance of this component in the application.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
validators | Validator[] | [] | An array of custom validators.

## Form

The component responsible for form's registration and submit handlers.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
name | string | | The form id and name
className | string | | The CSS classes for the native form component rendered by this component
onSubmit | Function | | A submit handler function which receives the form values object by parameter: `(formValues) => doSomething(formValues)`

## FormControl

Component responsible for injecting the controller of a form into a child component.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
form | string | | The name of a registered form (or to be registered later by an Form component)
onChange | Function | | A change event handler function which receives the form controller by parameter: `(formCtrl) => doSomething(formCtrl)`
inject | Function | | A function responsible for transforming the form controller into an object containing as key the name of the property to be injected and the value of the property: `(formCtrl) => ({injectedFormNameProp: formCtrl.formName})`

### Injects

Name | Type | Description
------------ | ------------- | -------------
formCtrl | FormStateController | The form controller

#### FormStateController

Name | Type | Description
------------ | ------------- | -------------
formName | string | The name of the watched form.
valid | boolean | `true` if the form is valid.
invalid | boolean | `true` if the form is invalid.
untouched | boolean | `true` if all fields of the form are untouched (field blur).
touched | boolean | `true` if any field of the form was touched (field blur).
pristine | boolean | `true` if all fields of the form never changed it's value since it's loaded or reseted.
dirty | boolean | `true` if any field of the form has changed it's value one or more times since it's loaded or reseted.
unchanged | boolean | `true` if all fields values of the form are exactly equals it's initial values.
changed | boolean | `true` if any field value of the form aren't exactly equals it's initial value.
values | object{string: string} | The fields values of the form: `{[fieldName]: [fieldValue]}`.
files | object{string: File[]} | The selected files of each file field of the form.
fields | object{string: FieldStateController} | The fields controllers of the form: `{[fieldName]: [fieldCtrl]}`
setFieldValue | Function | Method to programmatically change a field value: `props.formCtrl.setFieldValue('fieldName', 'newValue')`.

## Field

Component that injects an form's field control properties to it's child.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
name | string | | The name of the field.
form | string | | The name of the field's form.
className | string | | The CSS class to inject into it's component child.
required | boolean | false | `true` if the field is required.
pattern | string\|RegExp | | The regex to validate the field value.
type | string | text | The input field type. Supports all types, but currently only the "email" and "number" types has out of the box validation.
integer | boolean | false | `true` if when the Field type property is "number" and should validate to integer value.
match | string | | Another field name that the value of this field should match.
min | number\|string | | The min number value of a field with type "number".
max | number\|string | | The max number value of a field with type "number".
minLength | number\|string | | The min string value length of a field.
maxLength | number\|string | | The max string value length of a field.
inject | Function | | A function responsible for transforming the Field component injection properties into an object containing as key the name of the property to be injected and the value of the property: `(field) => ({injectedOnChange: field.onChange})`

### Injects

Name | Type | Description
------------ | ------------- | -------------
name | string | The name of the field.
form | string | The name of the field's form.
className | string | The CSS class to inject into it's component child.
required | boolean | false | `true` if the field is required.
pattern | string\|RegExp | The regex to validate the field value.
type | string | The input field type.
onChange | HTMLEventHandler | The field change event handler: `(e) => handleChange(e.target.value)`.
onBlur | HTMLEventHandler | The field blur event handler: `(e) => handleBlur(e.target.name)`.
value | string | The current field value.
files | File[] | The selected files of the field.
ctrl | FieldStateController | The field controller.

#### FieldStateController

Name | Type | Description
------------ | ------------- | -------------
valid | boolean | `true` if the field is valid.
invalid | boolean | `true` if the field is invalid.
untouched | boolean | `true` if the field is untouched (field blur).
touched | boolean | `true` if the field was touched (field blur).
pristine | boolean | `true` if the field never changed it's value since it's loaded or reseted.
dirty | boolean | `true` if the field has changed it's value one or more times since it's loaded or reseted.
unchanged | boolean | `true` if the field value is exactly equals it's initial value.
changed | boolean | `true` if the field value isn't exactly equals it's initial value.
value | string | The value of the field.
files | File[] | The field selected files.
errors | ValidationError[] | An array of strings with all current validation errors of the field.
props | FieldStateProperties | Some properties of the Field.

#### FieldStateProperties

Name | Type | Description
------------ | ------------- | -------------
type | string | The input field type.
required | boolean | `true` if the input field is required.
pattern | string\|RegExp | The regex to validate the field pattern.
integer | boolean | `true` if when the Field type property is "number" and should validate to integer value.
match | string | Another field name that the value of this field should match.
min | number\|string | The min number value of a field with type "number".
max | number\|string | The max number value of a field with type "number".
minLength | number\|string | The min string value length of a field.
maxLength | number\|string | The max string value length of a field.

#### ValidationError

Name | Type | Description
------------ | ------------- | -------------
key | string | Validation error message key.
params | object{string: any} | Validation error message parameters.
