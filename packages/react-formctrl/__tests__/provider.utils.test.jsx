import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, Field} from '../src'

import {inputInject} from '../tests-utils'

import {
    copyArray,
    copyError,
    copyErrors,
    copyFieldCtrl,
    copyFieldCtrlProps,
    copyFiles,
    copyFormCtrl,
    copyFormFields,
    copyFormFiles,
    copyFormValues
} from '../src/provider/provider.utils'

configure({adapter: new Adapter()})

describe('The provider.utils module', () => {

    const formName = "testForm"
    const fieldName = "testField"

    let dom, formCtrl, fieldCtrl
    beforeEach(() => {
        dom = mount(
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject} required>
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        )
        formCtrl = dom.state('forms')['testForm']
        expect(formCtrl).toBeDefined()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl).toBeDefined()
    })

    afterEach(() => {
        dom.unmount()
        dom = null
        formCtrl = null
    })
    
    // describe('The copyFiles() function', () => {
    // TODO: find a way to test it
    // })
    
    test('The copyArray() function', () => {
        const array = ['test']
        const newArray = copyArray(array)
        expect(newArray).not.toBe(array)
        expect(newArray).toEqual(array)
    })
    
    test('The copyFieldCtrlProps() function', () => {
        const props = fieldCtrl.props

        const newProps = copyFieldCtrlProps(props)

        expect(newProps).not.toBe(props)
        expect(newProps).toEqual(props)
    })
    
    test('The copyError() function', () => {
        const error = fieldCtrl.errors[0]

        const newError = copyError(error)

        expect(newError).not.toBe(error)
        expect(newError).toEqual(error)

    })
    
    test('The copyErrors() function', () => {
        const errors = fieldCtrl.errors

        const newErrors = copyErrors(errors)

        expect(newErrors).not.toBe(errors)
        expect(newErrors).toEqual(errors)
    })
    
    test('The copyFieldCtrl() function', () => {
        
        const newFieldCtrl = copyFieldCtrl(fieldCtrl)

        expect(newFieldCtrl).not.toBe(fieldCtrl)
        expect(newFieldCtrl).toEqual(fieldCtrl)
    })
    
    test('The copyFormValues() function', () => {
        
        const values = formCtrl.values

        const newValues = copyFormValues(values)

        expect(newValues).not.toBe(values)
        expect(newValues).toEqual(values)

    })
    
    // test('The copyFormFiles() function', () => {
    //     TODO: find a way to test it
    // })
    
    test('The copyFormFields() function', () => {
        const fields = formCtrl.fields

        const newFields = copyFormFields(fields)

        expect(newFields).not.toBe(fields)
        expect(newFields).toEqual(fields)

    })
    
    test('The copyFormCtrl() function', () => {
        
        const newFormCtrl = copyFormCtrl(formCtrl)

        expect(newFormCtrl).not.toBe(formCtrl)
        expect(newFormCtrl).toEqual(formCtrl)

    })

})