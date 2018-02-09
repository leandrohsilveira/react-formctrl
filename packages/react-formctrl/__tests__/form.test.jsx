import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import { mount, configure } from 'enzyme';

import { FormProvider, Form, FormControl, Field, controlledForm, formatDate } from '../src'

import { inputInject, InputWrapper } from './field.test'

export const formControlInject = (formCtrl) => {
    return {
        name: formCtrl.formName,
        formCtrl
    }
}

configure({ adapter: new Adapter() })

function Input({ form, name, type = 'text' }) {
    return (
        <Field form={form} name={name} type={type} inject={inputInject}>
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

                it('With empty values', () => {
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                it('With filled fields', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
                })

            })

            describe('When is reseted and then submited', () => {

                it('With empty values before reset', () => {
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(submited).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                it('With filled fields before reset', () => {

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

                it('With empty values', () => {
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                it('With filled fields', () => {

                    input1.simulate('change', { target: { value: fieldValue1 } })
                    input2.simulate('change', { target: { value: fieldValue2 } })
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
                })

            })

            describe('When is reseted and then submited', () => {

                it('With empty values before reset', () => {
                    form.simulate('reset')
                    form.simulate('submit')

                    expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                })

                it('With filled fields before reset', () => {

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

        let dom, form, input1, input2, formCtrl, reseted = false, onReset
        beforeEach(() => {
            onReset = () => reseted = true
            dom = mount((
                <FormProvider>
                    <Form name={formName1} onReset={onReset}>
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
            
            it('The reset handler is called', () => {
                expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                expect(reseted).toBeTruthy()
            })
        })

        describe('Without provide a reset handler', () => {

            beforeEach(() => {
                onReset = undefined;
                input1.simulate('change', { target: { value: fieldValue1 } })
                input2.simulate('change', { target: { value: fieldValue2 } })
                form.simulate('reset')
            })
            
            it('Nothing happens', () => {
                expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
                expect(reseted).toBeTruthy()
            })
        })
    })

})

describe('About <FormControl /> component', () => {

    const FormTest1 = ({ name, children }) => <Form name={name}>{children}</Form>
    const formName = 'formName1'

    describe('The <FormControl/> children', () => {

        it('With two or more childrens', () => {

            expect(() => {
                mount((
                    <FormProvider>
                        <FormControl form={formName} inject={formControlInject}>
                            <FormTest1 />
                            <FormTest1 />
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
                            <FormTest1 />
                        </FormControl>
                    </FormProvider>
                ))
                form = dom.find(FormTest1)
            })

            afterEach(() => {
                dom.unmount()
            })

            it('Injects formCtrl property', () => {
                expect(form.prop('formCtrl')).toBeDefined()
            })

            it('Injects name (formName) property', () => {
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

            afterEach(() => {
                dom.unmount()
            })

            it('Does not injects formCtrl property', () => {
                expect(form.prop('formCtrl')).toBeDefined()
            })

            it('Does not injects name (formName) property', () => {
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
                        <FormTest1>
                            <Input form={formName} name={fieldName1} />
                            <Input form={formName} name={fieldName2} />
                        </FormTest1>
                    </FormControl>
                </FormProvider>
            ))
            form = dom.find(FormTest1)
            input1 = dom.find(`input[name="${fieldName1}"]`)
            input2 = dom.find(`input[name="${fieldName2}"]`)
        })

        afterEach(() => {
            formCtrl = null
            dom.unmount()
        })

        it('When nothing has changed', () => {
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
        })

        it('When fields have been changed', () => {
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

describe('The <FormControl /> setFieldValue behaviour', () => {

    let _formCtrl = null
    const TestForm3 = ({ name, children, formCtrl }) => {
        _formCtrl = formCtrl
        return <Form name={name}>{children}</Form>
    }
    const formName = 'formControlSetFieldValueFormName'

    const fieldName = "fieldName"
    const fieldDateName = "fieldDateName"
    const fieldValue = "fieldValue"
    const fieldDateValue = new Date();

    let dom, form, input1, inputDate
    beforeEach(() => {
        dom = mount((
            <FormProvider>
                <FormControl form={formName} inject={formControlInject}>
                    <TestForm3>
                        <Input form={formName} name={fieldName} />
                        <Input form={formName} name={fieldDateName} type="date" />
                    </TestForm3>
                </FormControl>
            </FormProvider>
        ))
        form = dom.find(TestForm3)
        input1 = dom.find(`input[name="${fieldName}"]`)
    })

    afterEach(() => {
        _formCtrl = null
        dom.unmount()
    })

    describe('When set a string value', () => {

        it('The field value changes in form controller', () => {
            _formCtrl.setFieldValue(fieldName, fieldValue)
            expect(_formCtrl).toBeDefined()
            expect(_formCtrl.values).toEqual({ [fieldName]: fieldValue, [fieldDateName]: '' })
        })
    })

    describe('When set a Date value to a date type field', () => {

        it('The field value changes in form controller', () => {
            _formCtrl.setFieldValue(fieldDateName, fieldDateValue)
            expect(_formCtrl).toBeDefined()
            expect(_formCtrl.values).toEqual({ [fieldName]: '', [fieldDateName]: new Date(formatDate(fieldDateValue)) })
        })
    })

    describe('When set a Number value to a date type field', () => {

        it('The field value changes in form controller', () => {
            _formCtrl.setFieldValue(fieldDateName, fieldDateValue.getTime())
            expect(_formCtrl).toBeDefined()
            expect(_formCtrl.values).toEqual({ [fieldName]: '', [fieldDateName]: new Date(formatDate(fieldDateValue)) })
        })
    })

    describe('When attempt to set a value to a unregistred field', () => {

        it('Then nothing happens', () => {
            _formCtrl.setFieldValue('unregistredField', 'aValue')
            expect(_formCtrl).toBeDefined()
            expect(_formCtrl.values).toEqual({ [fieldName]: '', [fieldDateName]: '' })
        })
        
    })

})

describe('The <FormControl /> reset function behaviour', () => {

    const FormTest4 = ({ name, children }) => <Form name={name}>{children}</Form>
    const formName = "resetFunctionBehaviourForm";

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
                    <FormTest4>
                        <Input form={formName} name={fieldName1} />
                        <Input form={formName} name={fieldName2} />
                    </FormTest4>
                </FormControl>
            </FormProvider>
        ))
        form = dom.find(FormTest4)
        input1 = dom.find(`input[name="${fieldName1}"]`)
        input2 = dom.find(`input[name="${fieldName2}"]`)
    })

    afterEach(() => {
        formCtrl = null
        dom.unmount()
    })

    describe('When nothing has changed', () => {

        beforeEach(() => {
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
        })

        it('The form keep it\'s initial state', () => {
            formCtrl.reset();
            expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
        })

    })

    describe('When fields have been changed', () => {

        beforeEach(() => {
            input1.simulate('change', { target: { value: fieldValue1 } })
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: '' })
    
            input2.simulate('change', { target: { value: fieldValue2 } })
            expect(formCtrl).toBeDefined()
            expect(formCtrl.values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: fieldValue1, [fieldName2]: fieldValue2 })
        })

        it('The form reset to it\'s initial state', () => {
            formCtrl.reset();
            expect(formCtrl.values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
            expect(dom.state('forms')[formName].values).toEqual({ [fieldName1]: '', [fieldName2]: '' })
        })

    })

})

describe('The controlledForm() decorator behaviour', () => {
    const TestForm5 = ({ form }) => (
        <Form name={form}>
            <InputWrapper label="First name" form={form} name="firstName" />
            <InputWrapper label="Surname" form={form} name="surname" />
        </Form>
    );
    const DecoratedForm2 = controlledForm()(TestForm5)


    let dom, form
    beforeEach(() => {

        dom = mount((
            <FormProvider>
                <DecoratedForm2 form="decoratedForm" />
            </FormProvider>
        ))
        form = dom.find(TestForm5)
    })

    afterEach(() => {
        dom.unmount()
    })

    it('Injects formCtrl property', () => {
        expect(form.prop('formCtrl')).toBeDefined()
    })

    it('Injects form (formName) property', () => {
        expect(form.prop('form')).toBe('decoratedForm')
    })

})