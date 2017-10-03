import React from 'react'

import TestRenderer from 'react-test-renderer'
import {FormProvider, Form, Field} from '../src'

test('A form is registered', () => {
    
    const formName = 'testForm'
    
    const renderer = TestRenderer.create((
        <FormProvider>
            <Form name={formName}></Form>
        </FormProvider>
    ))

    const formProviderInstance = renderer.getInstance()

    const formCtrl = formProviderInstance.state.forms[formName]

    expect(formCtrl).toBeDefined()
    expect(formCtrl.formName).toBe(formName)
    expect(Object.keys(formCtrl.fields)).toHaveLength(0)

})

test('A field is registered', () => {
    
    const formName = 'testForm'
    const fieldName = 'testField'
    
    const renderer = TestRenderer.create((
        <FormProvider>
            <Form name={formName}>
                <Field form={formName} name={fieldName}>
                    <input />
                </Field>
            </Form>
        </FormProvider>
    ))

    const formProviderInstance = renderer.getInstance()

    const formCtrl = formProviderInstance.state.forms[formName]

    expect(formCtrl).toBeDefined()
    expect(formCtrl.formName).toBe(formName)
    expect(Object.keys(formCtrl.fields)).toHaveLength(1)

    const fieldCtrl = formCtrl.fields[fieldName]
    expect(fieldCtrl).toBeDefined()
    expect(fieldCtrl.value).toBe("")

})