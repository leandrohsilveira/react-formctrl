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

### Inject's

No property are injected into it's childrens by this component.

## FormControl

Component responsible for injecting the controller of a form into a child component.

### Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | --------------
form | String | | The name of a registered form (or to be registered later by an Form component)
onChange | Function | | A change event handler function which receives the form controller by parameter: `(formCtrl) => doSomething(formCtrl)`
inject | Function | | A function responsible for transforming the form controller into an object containing as key the name of the property to be injected and the value of the property: `(formCtrl) => ({injectedFormNameProp: formCtrl.formName})`

### Inject's

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
values | Map<String,String> | The fields values of the form: `{[fieldName]: [fieldValue]}`.
fields | Map<String,FieldCtrl> | The fields controllers of the form: `{[fieldName]: [fieldCtrl]}`

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
errors | List<String> | An array of Strings with all current validation errors of the field.