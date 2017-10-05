import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, FormControl, Field} from '../src'

import {inputInject, formControlInject} from '../tests-utils'


configure({adapter: new Adapter()})

function Input({form, name}) {
    return (
        <Field form={form} name={name} inject={inputInject}>
            <input />
        </Field>
    )
}

describe('About <Form /> component', () => {

    const formName1 = 'formName1'

    describe('The <Form /> submit behaviour', () => {

        const fieldName1 = "fieldName1"
        const fieldName2 = "fieldName2"
        const fieldValue1 = "fieldValue1"
        const fieldValue2 = "fieldValue2"

        let dom, submited, form, input1, input2
        beforeEach(() => {
            submited = null
            dom = mount((
                <FormProvider>
                    <Form name={formName1} onSubmit={(values) => submited = values}>
                        <Input form={formName1} name={fieldName1} />
                        <Input form={formName1} name={fieldName2} />
                    </Form>
                </FormProvider>
            ))
            form = dom.find(Form)
            input1 = dom.find(`input[name="${fieldName1}"]`)
            input2 = dom.find(`input[name="${fieldName2}"]`)
        })

        describe('When is submited', () => {

            test('With empty values', () => {
                form.simulate('submit')

                expect(submited).toEqual({[fieldName1]: '', [fieldName2]: ''})
            })

            test('With filled fields', () => {

                input1.simulate('change', {target: {value: fieldValue1}})
                input2.simulate('change', {target: {value: fieldValue2}})
                form.simulate('submit')

                expect(submited).toEqual({[fieldName1]: fieldValue1, [fieldName2]: fieldValue2})
            })

        })

        describe('When is reseted and then submited', () => {
            
            test('With empty values before reset', () => {
                form.simulate('reset')
                form.simulate('submit')
                
                expect(submited).toEqual({[fieldName1]: '', [fieldName2]: ''})
            })
            
            test('With filled fields before reset', () => {
                
                input1.simulate('change', {target: {value: fieldValue1}})
                input2.simulate('change', {target: {value: fieldValue2}})
                form.simulate('reset')
                form.simulate('submit')
                
                expect(submited).toEqual({[fieldName1]: '', [fieldName2]: ''})
            })

        })

    })

})

describe('About <FormControl /> component', () => {
    
    const formName = 'formName1'
    const FormTest = ({name, children}) => <Form name={name}>{children}</Form>

    describe('The <FormControl /> property injection', () => {

        let dom, form
        beforeEach(() => {

            dom = mount((
                <FormProvider>
                    <FormControl form={formName} inject={formControlInject}>
                        <FormTest />
                    </FormControl>
                </FormProvider>
            ))
            form = dom.find(FormTest)
        })

        test('Injects formCtrl property', () => {
            expect(form.prop('formCtrl')).toBeDefined()
        })

        test('Injects form (formName) property', () => {
            expect(form.prop('name')).toBe(formName)
        })

    })


    describe('The <FormControl /> change behaviour', () => {
        
        const fieldName1 = "fieldName1"
        const fieldName2 = "fieldName2"
        const fieldValue1 = "fieldValue1"
        const fieldValue2 = "fieldValue2"

        let dom, formCtrl, form, input1, input2
        beforeEach(() => {
            formCtrl = null
            dom = mount((
                <FormProvider>
                    <FormControl form={formName} onChange={(_formCtrl) => formCtrl = _formCtrl} inject={formControlInject}>
                        <FormTest>
                            <Input form={formName} name={fieldName1} />
                            <Input form={formName} name={fieldName2} />
                        </FormTest>
                    </FormControl>
                </FormProvider>
            ))
            form = dom.find(FormTest)
            input1 = dom.find(`input[name="${fieldName1}"]`)
            input2 = dom.find(`input[name="${fieldName2}"]`)
        })

        afterEach(() => {
            formCtrl = null
            dom.unmount()
        })

        test('When nothing has changed', () => {
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({[fieldName1]: '', [fieldName2]: ''})
            expect(dom.state('forms')[formName].values).toEqual({[fieldName1]: '', [fieldName2]: ''})
        })
        
        test('When fields have been changed', () => {
            input1.simulate('change', {target: {value: fieldValue1}})
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({[fieldName1]: fieldValue1, [fieldName2]: ''})
            expect(dom.state('forms')[formName].values).toEqual({[fieldName1]: fieldValue1, [fieldName2]: ''})
            
            input2.simulate('change', {target: {value: fieldValue2}})
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({[fieldName1]: fieldValue1, [fieldName2]: fieldValue2})
            expect(dom.state('forms')[formName].values).toEqual({[fieldName1]: fieldValue1, [fieldName2]: fieldValue2})
        })

    })

    

})