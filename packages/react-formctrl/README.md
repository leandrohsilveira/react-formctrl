[![Build Status](https://travis-ci.org/leandrohsilveira/react-formctrl.svg?branch=master)](https://travis-ci.org/leandrohsilveira/react-formctrl) 
[![Coverage Status](https://coveralls.io/repos/github/leandrohsilveira/react-formctrl/badge.svg?branch=master)](https://coveralls.io/github/leandrohsilveira/react-formctrl?branch=master) 
[![Known Vulnerabilities](https://snyk.io/test/github/leandrohsilveira/react-formctrl/badge.svg)](https://snyk.io/test/github/leandrohsilveira/react-formctrl)

# React Form CTRL 
A lightweight React form library inspired by Angular's forms and Redux-Form.

Bundle size: 29.6 KB (5.9 KB gzipped) (09/29/2017, v1.2.0)

## Quick start

`npm install --save react-formctrl`

### Wrap all your application with:
```jsx
export function App(props) {
    return (
        <FormProvider>
            {'... your app ...'}
        </FormProvider>
    )
}
```

### Then wrap your field component:
```jsx
/* some injected props: */
function MyInput({label, placeholder, name, type, required, onChange, onBlur, value}) {

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
                value={value} />
        </div>
    );
}

function InputField({label, placeholder, form, name, type, initialValue, required, pattern, integer}) {
    return (
        <Field form={form} 
                name={name} 
                type={type} 
                initialValue={initialValue} 
                required={required} 
                integer={integer}
                pattern={pattern}>
            <MyInput label={label} placeholder={placeholder} />
        </Field>
    )
}

```

### And build your forms:
```jsx

/*
 * EASY REAUSABLE FORMS!
 */
function UserForm(props) {
    const formName = props.formCtrl.formName
    const user = props.user || {name: '', email: ''}
    return (
        <div class="form-container">
            <Form name={formName} onSubmit={props.onSubmit}>
                <div class="fieldset">
                    <div class="fields-container">
                        <InputField form={formName} name="name" label="Name" initialValue={user.name} required />
                        <InputField form={formName} name="email" type="email" label="E-mail" initialValue={user.email} required />
                        <InputField form={formName} name="confirmEmail" type="email" label="Confirm e-mail" initialValue={user.email} required match="email" />
                        <InputField form={formName} name="password" type="password" label="Password" required minLength={8} />
                        <InputField form={formName} name="confirmPassword" type="password" label="Confirm password" required minLength={8} match="password" />
                    </div>
                    <div class="buttons-container">
                        <button type="submit" disabled={props.formCtrl.invalid || props.formCtrl.unchanged}>Save</button>
                        <button type="reset" disabled={props.formCtrl.unchanged}>Reset</button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

function RegisterUser() {
    const handleSubmit = (values) => UserService.create(values)
    return (
        <FormControl name="registerUserForm">
            <UserForm onSubmit={postUser} />
        </FormControl>
    )
}

class UpdateUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        UserService.find(this.props.id)
                    .then(user => this.setState({user}))
    }

    handleSubmit(values) {
        UserService.update(this.props.id, values)
    }

    render() {
        if(this.state.user) {
            // Initial values are applied only on componentWillMount phase! Do not load the component with null or empty values!
            return (
                <FormControl name="updateUserForm">
                    <UserForm onSubmit={this.handleSubmit} user={this.state.user} />
                </FormControl>
            )
        } else {
            return <div>Loading user data...</div>
        }

    }

}

```

# Components

## FormProvider

The component that controls all form values and events. There may only be one instance of this component in the application.

## Form

The component that registers the form in FormProvider component and listen to submit and reset form events.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
name | string | | The form id and name
className | string | | The CSS classes for the native form component rendered by this component
onSubmit | Function | | A submit handler function which receives the form values object by parameter: `(formValues) => doSomething(formValues)`

### Injects

No property are injected into it's childrens by this component.

## FormControl

Component responsible for injecting the controller of a form into a child component.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
form | string | | The name of a registered form (or to be registered later by an Form component)
onChange | Function | | A change event handler function which receives the form controller by parameter: `(formCtrl) => doSomething(formCtrl)`
inject | Function | | A function responsible for transforming the form controller into an object containing as key the name of the property to be injected and the value of the property: `(formCtrl) => ({injectedFormNameProp: formCtrl.formName})`

### Injects

The table below shows the fields of the "formCtrl" property that will be injected by this component into the child component, which can be changed through the "inject" property:

```jsx
/*
 * The Form component can be a child of it's own FormControl, the FormControl component waits the Form component register to FormProvider.
 */
function DefaultInjection(props) {
    return (
        <Form name={props.formCtrl.formName}>
            <div>{/*... fields ...*/}</div>
        </Form>
    )
}
function CustomInjection(props) {
    return (
        <Form name={props.injectedFormName}>
            <div>{/*... fields ...*/}</div>
        </Form>
    )
}

function Page(props) {
    const defaultInjectionFormName = "defaultForm"
    const customInjectionFormName = "injectedForm"
    const inject = (formCtrl) => ({injectedFormName: formCtrl.formName})
    return (
        <div>
            <FormControl form={defaultInjectionFormName}>
                <DefaultInjection />
            </FormControl>
            <FormControl form={customInjectionFormName} inject={inject}>
                <CustomInjection />
            </FormControl>
        </div>
    )
}
```

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

```jsx
function InputWrapper(props) {
    const messages = null
    if(props.ctrl.invalid) {
        messages = (
            <ul>
                {props.ctrl.errors.map(error => (
                    <li>{error}</li>
                ))}
            </ul>
        )
    }
    return (
        <div>
            <input {...props} />
            {messages}
        </div>
    )
}
function SomeForm(props) {
    const formName = props.formCtrl.formName
    return (
        <Form formName={formName} onSubmit={props.onSubmit}>
            <div>
                {/* The Field props overrides the child props:*/}
                <Field form={formName} name="nativeInput" type="number">
                    <input type="text" placeholder="Native input (number)" />
                </Field>

                <Field form={formName} name="email" type="email" required>
                    <InputWrapper placeholder="Native input (number)" />
                </Field>

                <button type="submit" disabled={props.formCtrl.invalid}>Submit</button>
            </div>
        </Form>
    )
}
function Page(props) {
    const handleSubmit(values) {
        console.log('Values:', values) // # Values: {nativeInput: '50', email: 'email@email.com'}
    }
    return (
        <FormProvider form="someForm">
            <SomeForm />
        </FormProvider>
    )
}

```

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
