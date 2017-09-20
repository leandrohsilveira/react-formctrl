# React controlled forms
A lightweight ReactJS forms controller inspired by Redux-form and Angular forms.

It's lightweight: 18.9 KB of bundle size.


**Under development**

## <a href="https://leandrohsilveira.github.io/react-formctrl/">Live demo</a>

### Just wrap all your forms with:
```jsx
import {FormProvider} from 'react-formctrl';

export function App(props) {
    return (
        <FormProvider>
            {'... routes, rest of your app ...'}
        </FormProvider>
    )
}
```

### Wrap your components for full form controlling:
```jsx
import {FormControl, Form, Field} from 'react-formctrl';


/* some injected props: */
export function Input({name, type, onChange, onBlur, value}) {
    return (
        <input name={name} 
                type={type} 
                onChange={onChange} 
                onBlur={onBlur} 
                value={value}>
        </input>
    );
}

/* some injected props: */
export function SomeForm({formName, values, invalid, dirty}) {

    return (
        <div>
            <Form name={formName}>
                {/* No hierarchy needed. */}
                <div className="field">
                    <Field form={formName} name="username">
                        <Input></Input>
                    </Field>
                </div>
                <div className="field">
                    <Field form={formName} name="password" type="password">
                        <Input></Input>
                    </Field>
                </div>
                <div className="buttons">
                    <button type="submit" disabled={invalid && dirty}>Submit</button>
                </div>
            </Form>
        </div>
    );
}

export function SomeContainer(props) {
    const formName = "someForm";
    return (
        <div className="page">
            <h1>Some container</h1>
            <FormControl form={formName}>
                <SomeForm formName={formName}></SomeForm>
            </FormControl>
        </div>
    )
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
name | String | | The form id and name
className | String | | The CSS classes for the native form component rendered by this component
onSubmit | Function | | A submit handler function which receives the form values object by parameter: `(formValues) => doSomething(formValues)`

### Injects

No property are injected into it's childrens by this component.

## FormControl

Component responsible for injecting the controller of a form into a child component.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
form | String | | The name of a registered form (or to be registered later by an Form component)
onChange | Function | | A change event handler function which receives the form controller by parameter: `(formCtrl) => doSomething(formCtrl)`
inject | Function | | A function responsible for transforming the form controller into an object containing as key the name of the property to be injected and the value of the property: `(formCtrl) => ({injectedFormNameProp: formCtrl.formName})`

### Injects

The table below shows the fields of the "formCtrl" property that will be injected by this component into the child component, which can be changed through the "inject" property:

```jsx
/*
 * The Form component can be a child of it's own FormControl, the FormControl component waits the Form component register to FormProvider.
 */
function Default(props) {
    return (
        <Form name={props.formCtrl.formName}>
            <div>{/*... fields ...*/}</div>
        </Form>
    )
}
function Child(props) {
    return (
        <Form name={props.injectedFormName}>
            <div>{/*... fields ...*/}</div>
        </Form>
    )
}

function Page(props) {
    const defaultFormName = "defaultForm"
    const injectedFormName = "injectedForm"
    const inject = (formCtrl) => ({injectedFormName: formCtrl.formName})
    return (
        <div>
            <FormControl form={defaultFormName}>
                <Child />
            </FormControl>
            <FormControl form={injectedFormName} inject={inject}>
                <Child />
            </FormControl>
        </div>
    )
}
```

#### FormCtrl

Name | Type | Description
------------ | ------------- | -------------
formName | String | The name of the watched form.
valid | boolean | `true` if the form is valid.
invalid | boolean | `true` if the form is invalid.
untouched | boolean | `true` if all fields of the form are untouched (field blur).
touched | boolean | `true` if any field of the form was touched (field blur).
pristine | boolean | `true` if all fields of the form never changed it's value since it's loaded or reseted.
dirty | boolean | `true` if any field of the form has changed it's value one or more times since it's loaded or reseted.
unchanged | boolean | `true` if all fields values of the form are exactly equals it's initial values.
changed | boolean | `true` if any field value of the form aren't exactly equals it's initial value.
values | Object{String: String} | The fields values of the form: `{[fieldName]: [fieldValue]}`.
fields | Object{String: FieldCtrl} | The fields controllers of the form: `{[fieldName]: [fieldCtrl]}`


## Field



### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
name | String | | The name of the field.
form | String | | The name of the field's form.
className | String | | The CSS class to inject into it's component child.
required | boolean | false | `true` if the field is required.
pattern | String\|RegExp | | The regex to validate the field value.
type | String | text | The input field type. Supports all types, but currently only the "email" and "number" types has out of the box validation.
integer | boolean | false | `true` if when the Field type property is "number" and should validate to integer value.
inject | Function | | A function responsible for transforming the Field component injection properties into an object containing as key the name of the property to be injected and the value of the property: `(field) => ({injectedOnChange: field.onChange})`

### Injects

Name | Type | Description
------------ | ------------- | -------------
name | String | The name of the field.
form | String | The name of the field's form.
className | String | The CSS class to inject into it's component child.
required | boolean | false | `true` if the field is required.
pattern | String\|RegExp | The regex to validate the field value.
type | String | The input field type.
onChange | HTMLEventHandler | The field change event handler: `(e) => handleChange(e.target.value)`.
onBlur | HTMLEventHandler | The field blur event handler: `(e) => handleBlur(e.target.name)`.
value | String | The current field value.
ctrl | FieldCtrl | The field controller.

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
                    <input type="text" placeholder="Native input (Number)" />
                </Field>

                <Field form={formName} name="email" type="email" required>
                    <InputWrapper placeholder="Native input (Number)" />
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

#### FieldCtrl

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
value | String | The value of the field.
errors | String[] | An array of Strings with all current validation errors of the field.
props | FieldProperties | Some properties of the Field.

#### FieldProperties

Name | Type | Description
------------ | ------------- | -------------
type | String | The input field type.
required | boolean | `true` if the input field is required.
pattern | String\|RegExp | The regex to validate the field pattern.
match | String | Another field name that the value of this field should match.
integer | boolean | `true` if when the Field type property is "number" and should validate to integer value.
min | Number | The min Number value of a field with type "number".
max | Number | The max Number value of a field with type "number".
minLength | Number | The min String value length of a field.
maxLength | Number | The max String value length of a field.