import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, Field} from '../src'

import {inputInject} from '../tests-utils'

configure({adapter: new Adapter()})

describe('The Field component behaviour', () => {

    test('The field controller changes on field change event', () => {
    
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject}>
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        ))
    
        // form in pristine, unchanged and untouched state
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl).toBeDefined()
        expect(formCtrl.formName).toBe(formName)
        expect(formCtrl.values[fieldName]).toBe('')
        expect(formCtrl.pristine).toBeTruthy()
        expect(formCtrl.dirty).toBeFalsy()
        expect(formCtrl.unchanged).toBeTruthy()
        expect(formCtrl.changed).toBeFalsy()
        expect(formCtrl.untouched).toBeTruthy()
        expect(formCtrl.touched).toBeFalsy()
    
        // field in pristine, unchanged and untouched state
        let fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.pristine).toBeTruthy()
        expect(fieldCtrl.dirty).toBeFalsy()
        expect(fieldCtrl.unchanged).toBeTruthy()
        expect(fieldCtrl.changed).toBeFalsy()
        expect(fieldCtrl.untouched).toBeTruthy()
        expect(fieldCtrl.touched).toBeFalsy()
    
        // find input
        const input = dom.find('input')
    
        // simulate focus
        input.simulate('focus')
    
        // simulate change
        input.simulate('change', {target: {value: fieldValue}})
        
        // form in dirty, changed and untouched state
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl).toBeDefined()
        expect(formCtrl.formName).toBe(formName)
        expect(formCtrl.values[fieldName]).toBe(fieldValue)
        expect(formCtrl.pristine).toBeFalsy()
        expect(formCtrl.dirty).toBeTruthy()
        expect(formCtrl.unchanged).toBeFalsy()
        expect(formCtrl.changed).toBeTruthy()
        expect(formCtrl.untouched).toBeTruthy()
        expect(formCtrl.touched).toBeFalsy()
    
        // field in dirty, changed and untouched state
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.pristine).toBeFalsy()
        expect(fieldCtrl.dirty).toBeTruthy()
        expect(fieldCtrl.unchanged).toBeFalsy()
        expect(fieldCtrl.changed).toBeTruthy()
        expect(fieldCtrl.untouched).toBeTruthy()
        expect(fieldCtrl.touched).toBeFalsy()
    
        // simulate blur
        input.simulate('blur')
    
        // form in dirty, changed and touched state
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl).toBeDefined()
        expect(formCtrl.formName).toBe(formName)
        expect(formCtrl.values[fieldName]).toBe(fieldValue)
        expect(formCtrl.pristine).toBeFalsy()
        expect(formCtrl.dirty).toBeTruthy()
        expect(formCtrl.unchanged).toBeFalsy()
        expect(formCtrl.changed).toBeTruthy()
        expect(formCtrl.untouched).toBeFalsy()
        expect(formCtrl.touched).toBeTruthy()
    
        // field in dirty, changed and touched state
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.pristine).toBeFalsy()
        expect(fieldCtrl.dirty).toBeTruthy()
        expect(fieldCtrl.unchanged).toBeFalsy()
        expect(fieldCtrl.changed).toBeTruthy()
        expect(fieldCtrl.untouched).toBeFalsy()
        expect(fieldCtrl.touched).toBeTruthy()
    
    
    })

    test('The required validation works', () => {
        
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject} required>
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        ))
    
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        let fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'required'})
    
        // find input
        const input = dom.find('input')
        // simulate change
        input.simulate('change', {target: {value: fieldValue}})

        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)

    })

    test('The e-mail validation works', () => {
        
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue1 = "testValue"
        const fieldValue2 = "testValue@test"
        const fieldValue3 = "testValue@test.com"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject} type="email">
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        ))
    
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        let fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: ''}})
    
        const input = dom.find('input')

        // invalid e-mail 1
        input.simulate('change', {target: {value: fieldValue1}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: fieldValue1}})

        // invalid e-mail 2
        input.simulate('change', {target: {value: fieldValue2}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: fieldValue2}})

        // valid e-mail
        input.simulate('change', {target: {value: fieldValue3}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)

    })


    test('The float number validation works', () => {
        
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue1 = "testValue"
        const fieldValue2 = "1.5"
        const fieldValue3 = "1"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject} type="number">
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        ))
    
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        let fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'float', params: {value: ''}})
    
        const input = dom.find('input')

        // invalid number
        input.simulate('change', {target: {value: fieldValue1}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'float', params: {value: fieldValue1}})

        // valid float number
        input.simulate('change', {target: {value: fieldValue2}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)

        // valid float number 2
        input.simulate('change', {target: {value: fieldValue3}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)

    })

    test('The integer number validation works', () => {
        
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue1 = "testValue"
        const fieldValue2 = "1.5"
        const fieldValue3 = "1"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <Field form={formName} name={fieldName} inject={inputInject} type="number" integer>
                        <input />
                    </Field>
                </Form>
            </FormProvider>
        ))
    
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        let fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: ''}})
    
        const input = dom.find('input')

        // invalid number
        input.simulate('change', {target: {value: fieldValue1}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: fieldValue1}})

        // invalid integer number
        input.simulate('change', {target: {value: fieldValue2}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: fieldValue2}})


        // valid integer number
        input.simulate('change', {target: {value: fieldValue3}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)

    })

    test('The match validation works', () => {
        
        const formName = "testForm"
        const fieldName1 = "testField1"
        const fieldName2 = "testField2"


        const fieldValue1 = "testValue"
        const fieldValue2 = "testValue2"
    
        const dom = mount((
            <FormProvider>
                <Form name={formName}>
                    <div>
                        <Field form={formName} className={fieldName1} name={fieldName1} inject={inputInject} required>
                            <input />
                        </Field>
                        <Field form={formName} className={fieldName2} name={fieldName2} inject={inputInject} match={fieldName1} required>
                            <input />
                        </Field>
                    </div>
                </Form>
            </FormProvider>
        ))
    
        let formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        let fieldCtrl = formCtrl.fields[fieldName1]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'required'})
        fieldCtrl = formCtrl.fields[fieldName2]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'required'})
    
        const input1 = dom.find(`input.${fieldName1}`)
        const input2 = dom.find(`input.${fieldName2}`)

        // filled first field
        input1.simulate('change', {target: {value: fieldValue1}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName1]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)
        fieldCtrl = formCtrl.fields[fieldName2]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'required'})


        // filled seccond field with different value
        input2.simulate('change', {target: {value: fieldValue2}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeFalsy()
        expect(formCtrl.invalid).toBeTruthy()
        fieldCtrl = formCtrl.fields[fieldName1]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)
        fieldCtrl = formCtrl.fields[fieldName2]
        expect(fieldCtrl.valid).toBeFalsy()
        expect(fieldCtrl.invalid).toBeTruthy()
        expect(fieldCtrl.errors).toContainEqual({key: 'match', params: {value: fieldValue2, match: fieldName1}})


        // filled seccond field with the same first field value
        input2.simulate('change', {target: {value: fieldValue1}})
        formCtrl = dom.state('forms')[formName]
        expect(formCtrl.valid).toBeTruthy()
        expect(formCtrl.invalid).toBeFalsy()
        fieldCtrl = formCtrl.fields[fieldName1]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)
        fieldCtrl = formCtrl.fields[fieldName2]
        expect(fieldCtrl.valid).toBeTruthy()
        expect(fieldCtrl.invalid).toBeFalsy()
        expect(fieldCtrl.errors).toHaveLength(0)


    })



    
})

