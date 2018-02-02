import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import { mount, configure } from 'enzyme';

import { FormProvider, Form, FormControl, Field, controlledForm } from '../src'

import { inputInject, InputWrapper } from './field.test'

export const formControlInject = (formCtrl) => ({
    name: formCtrl.formName,
    formCtrl
})

configure({ adapter: new Adapter() })

function Input({ form, name }) {
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

        describe('With the submit handler attached', () => {

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

                    expect(submited).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                test('With filled fields', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
                })

            })

            describe('When is reseted and then submited', () => {

                test('With empty values before reset', () => {
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                test('With filled fields before reset', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

            })

        })

        describe('Without an submit handler', () => {

            let dom, form, input1, input2, formCtrl
            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName1}>
                            <Input form={formName1} name={fieldName1} />
                            <Input form={formName1} name={fieldName2} />
                        </Form>
                    </FormProvider>
                ))
                form = dom.find(Form)
                formCtrl = dom.state('forms')[formName1]
                input1 = dom.find(`input[name="${fieldName1}"]`)
                input2 = dom.find(`input[name="${fieldName2}"]`)
            })

            describe('When is submited', () => {

                test('With empty values', () => {
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                test('With filled fields', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
                })

            })

            describe('When is reseted and then submited', () => {

                test('With empty values before reset', () => {
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                test('With filled fields before reset', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

            })


        })


    })

    describe('The <Form /> reset behaviour', () => {

        const fieldName1 = "fieldName1"
        const fieldName2 = "fieldName2"
        const fieldValue1 = "fieldValue1"
        const fieldValue2 = "fieldValue2"

        let dom, form, input1, input2, formCtrl, reseted = false
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName1} onReset={() => reseted = true}>
                        <Input form={formName1} name={fieldName1} />
                        <Input form={formName1} name={fieldName2} />
                    </Form>
                </FormProvider>
            ))
            form = dom.find(Form)
            formCtrl = dom.state('forms')[formName1]
            input1 = dom.find(`input[name="${fieldName1}"]`)
            input2 = dom.find(`input[name="${fieldName2}"]`)
        })

        describe('With filled fields before reset', () => {

            beforeEach(() => {
                input1.simulate('change', { target: { value: fieldValue1 } })
                input2.simulate('change', { target: { value: fieldValue2 } })
                form.simulate('reset')
            })

            test('The reset handler is called', () => {
                expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                expect(reseted).toBeTruthy()
            })
        })
    })

})

describe('About <FormControl /> component', () => {

    const FormTest = ({ name, children }) => <Form name={name}>{children}</Form>
    const formName = 'formName1'

    describe('The <FormControl/> children', () => {

        test('With two or more childrens', () => {

            expect(() => {
                mount((
                    <FormProvider>
                        <FormControl form={formName} inject={formControlInject}>
                            <FormTest />
                            <FormTest />
                        </FormControl>
                    </FormProvider>
                ))
            }).toThrowError(`The FormControl component for "${formName}" should have only one child, but has 2.`)

        })
    })

    describe('The <FormControl /> property injection', () => {

        describe('With the inject property', () => {

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

            test('Injects name (formName) property', () => {
                expect(form.prop('name')).toBe(formName)
            })
        })

        describe('Without the inject property', () => {

            const FormTest2 = ({ formCtrl, children }) => <Form name={formCtrl.formName}>{children}</Form>

            let dom, form
            beforeEach(() => {

                dom = mount((
                    <FormProvider>
                        <FormControl form={formName}>
                            <FormTest2 />
                        </FormControl>
                    </FormProvider>
                ))
                form = dom.find(FormTest2)
            })

            test('Does not injects formCtrl property', () => {
                expect(form.prop('formCtrl')).toBeDefined()
            })

            test('Does not injects name (formName) property', () => {
                expect(form.prop('name')).not.toBeDefined()
            })

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
            expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
        })

        test('When fields have been changed', () => {
            input1.simulate('change', { target: { value: fieldValue1 } })
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: '' })

            input2.simulate('change', { target: { value: fieldValue2 } })
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
        })

    })

})

describe('The controlledForm() decorator behaviour', () => {
    const TestForm = ({ form }) => (
        <Form name={form}>
            <InputWrapper label="First name" form={form} name="firstName" />
            <InputWrapper label="Surname" form={form} name="surname" />
        </Form>
    );
    const DecoratedForm = controlledForm()(TestForm)


    let dom, form
    beforeEach(() => {

        dom = mount((
            <FormProvider>
                <DecoratedForm form="decoratedForm" />
            </FormProvider>
        ))
        form = dom.find(TestForm)
    })

    test('Injects formCtrl property', () => {
        console.log(form.props());
        expect(form.prop('formCtrl')).toBeDefined()
    })

    test('Injects form (formName) property', () => {
        expect(form.prop('form')).toBe('decoratedForm')
    })

})