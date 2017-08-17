# React controlled forms
A lightweight ReactJS forms controller inspired by Redux-form and Angular forms.

It's lightweight: 18.9 KB of bundle size.


**Under development**

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

## <a href="https://leandrohsilveira.github.io/react-formctrl/">Live demo</a>