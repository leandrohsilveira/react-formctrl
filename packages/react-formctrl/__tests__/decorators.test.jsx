import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import { mount, configure, shallow } from 'enzyme';

import { FormProvider, Form, CustomValidator, Field, controlledField, formatDate, formatDateTime } from '../src'

import {InputWrapper} from './field.test'

configure({ adapter: new Adapter() })

class NoFieldValueValidator extends CustomValidator {

    constructor() {
        super('noTestValue')
    }

    validate(formCtrl, props, value, files) {
        return value !== 'testValue'
    }

}

class NoFieldValue2Validator extends CustomValidator {

    constructor() {
        super('noTestValue2')
    }

    validate(formCtrl, props, value, files) {
        return value !== 'testValue2'
    }

}

describe('The controlledField() decorator', () => {
    
    describe('Without a previously registered form to attach the field', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        beforeEach(() => {
            dom = mount((
                <FormProvider validators={[new NoFieldValueValidator()]}>
                    <InputWrapper form={formName} name={fieldName} />
                </FormProvider>
            ))
        })

        it('No form available in state', () => {
            const formCtrl = dom.state('forms')[formName]
            expect(formCtrl).not.toBeDefined()
        })

        it('The input changes do nothing', () => {
            dom.find('input').simulate('change', { target: { value: 'test' } })
            const formCtrl = dom.state('forms')[formName]
            expect(formCtrl).not.toBeDefined()
        })

        afterEach(() => {
            dom.find(Field).instance().componentWillUnmount()
            dom.unmount()
            dom = null
        })


    })

    describe('The field properties change behaviour', () => {
        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        let input
        let field
        beforeEach(() => {

            dom = mount((
                <FormProvider validators={[new NoFieldValueValidator()]}>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} />
                    </Form>
                </FormProvider>
            ))
            field = dom.find(Field).instance()


            input = dom.find('input')
        })

        afterEach(() => {
            dom.unmount()
        })

        describe('When Field properties do not changes', () => {
            let formCtrl, fieldCtrl
            beforeEach(() => {
                field.componentWillReceiveProps({ ...field.props })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            describe('When the field is empty', () => {

                it('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                it('The field is valid', () => {
                    expect(fieldCtrl.valid).toBeTruthy()
                    expect(fieldCtrl.invalid).toBeFalsy()
                })

                it('The field does not contains errors messages', () => {
                    expect(fieldCtrl.errors).toHaveLength(0)
                })

            })
        })

        describe('When Field required property changes', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {

                field.componentWillReceiveProps({ ...field.props, required: true })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            describe('When the field is empty', () => {
                it('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                it('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                it('The field contains a "required" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({ key: 'required' })
                })

            })

        })

        describe('When Field pattern property changes', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue } })
                field.componentWillReceiveProps({ ...field.props, pattern: /d+/ })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            describe(`When the field has "${fieldValue}" value`, () => {

                it('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                it('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                it('The field contains a "required" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({ key: 'pattern', params: { value: fieldValue, pattern: /d+/ } })
                })

            })

            describe('When Field type property changes', () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue } })
                    field.componentWillReceiveProps({ ...field.props, type: "email" })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                describe(`When the field has "${fieldValue}" value`, () => {

                    it('The form is invalid', () => {
                        expect(formCtrl.valid).toBeFalsy()
                        expect(formCtrl.invalid).toBeTruthy()
                    })

                    it('The field is invalid', () => {
                        expect(fieldCtrl.valid).toBeFalsy()
                        expect(fieldCtrl.invalid).toBeTruthy()
                    })

                    it('The field contains a "email" error message', () => {
                        expect(fieldCtrl.errors).toContainEqual({ key: 'email', params: { value: fieldValue } })
                    })

                })

            })

            describe('When Field integer property changes', () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue } })
                    field.componentWillReceiveProps({ ...field.props, type: "number" })
                    field.componentWillReceiveProps({ ...field.props, type: "number", integer: true })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                describe(`When the field has "${fieldValue}" value`, () => {

                    it('The form is invalid', () => {
                        expect(formCtrl.valid).toBeFalsy()
                        expect(formCtrl.invalid).toBeTruthy()
                    })

                    it('The field is invalid', () => {
                        expect(fieldCtrl.valid).toBeFalsy()
                        expect(fieldCtrl.invalid).toBeTruthy()
                    })

                    it('The field contains a "integer" error message', () => {
                        expect(fieldCtrl.errors).toContainEqual({ key: 'integer', params: { value: fieldValue } })
                    })

                })

            })

            describe('When Field validate property changes', () => {

                describe('When validate is string', () => {

                    let formCtrl, fieldCtrl
                    beforeEach(() => {
                        input.simulate('change', { target: { value: fieldValue } })
                        field.componentWillReceiveProps({ ...field.props, validate: 'noTestValue' })
                        formCtrl = dom.state('forms')[formName]
                        expect(formCtrl).toBeDefined()
                        fieldCtrl = formCtrl.fields[fieldName]
                        expect(fieldCtrl).toBeDefined()
                    })

                    describe(`When the field has "${fieldValue}" value`, () => {

                        it('The form is invalid', () => {
                            expect(formCtrl.valid).toBeFalsy()
                            expect(formCtrl.invalid).toBeTruthy()
                        })

                        it('The field is invalid', () => {
                            expect(fieldCtrl.valid).toBeFalsy()
                            expect(fieldCtrl.invalid).toBeTruthy()
                        })

                        it('The field contains a "noTestValue" error message', () => {
                            expect(fieldCtrl.errors).toContainEqual({ key: 'noTestValue', params: { value: fieldValue } })
                        })

                    })

                })

                describe('When validate is string', () => {

                    let formCtrl, fieldCtrl
                    beforeEach(() => {
                        input.simulate('change', { target: { value: fieldValue } })
                        field.componentWillReceiveProps({ ...field.props, validate: 'noTestValue' })
                        formCtrl = dom.state('forms')[formName]
                        expect(formCtrl).toBeDefined()
                        fieldCtrl = formCtrl.fields[fieldName]
                        expect(fieldCtrl).toBeDefined()
                    })

                    describe(`When the field has "${fieldValue}" value`, () => {

                        it('The form is invalid', () => {
                            expect(formCtrl.valid).toBeFalsy()
                            expect(formCtrl.invalid).toBeTruthy()
                        })

                        it('The field is invalid', () => {
                            expect(fieldCtrl.valid).toBeFalsy()
                            expect(fieldCtrl.invalid).toBeTruthy()
                        })

                        it('The field contains a "noTestValue" error message', () => {
                            expect(fieldCtrl.errors).toContainEqual({ key: 'noTestValue', params: { value: fieldValue } })
                        })

                    })

                })

                describe('When validate is array', () => {

                    let formCtrl, fieldCtrl
                    beforeEach(() => {
                        input.simulate('change', { target: { value: fieldValue } })
                        field.componentWillReceiveProps({ ...field.props, validate: ['noTestValue'] })
                        formCtrl = dom.state('forms')[formName]
                        expect(formCtrl).toBeDefined()
                        fieldCtrl = formCtrl.fields[fieldName]
                        expect(fieldCtrl).toBeDefined()
                    })

                    describe(`When the field has "${fieldValue}" value`, () => {

                        it('The form is invalid', () => {
                            expect(formCtrl.valid).toBeFalsy()
                            expect(formCtrl.invalid).toBeTruthy()
                        })

                        it('The field is invalid', () => {
                            expect(fieldCtrl.valid).toBeFalsy()
                            expect(fieldCtrl.invalid).toBeTruthy()
                        })

                        it('The field contains a "noTestValue" error message', () => {
                            expect(fieldCtrl.errors).toContainEqual({ key: 'noTestValue', params: { value: fieldValue } })
                        })

                    })

                })

                describe('When validate change from string to array', () => {

                    let formCtrl, fieldCtrl
                    beforeEach(() => {
                        input.simulate('change', { target: { value: fieldValue } })
                        field.componentWillReceiveProps({ ...field.props, validate: 'noTestValue' })
                        field.componentWillReceiveProps({ ...field.props, validate: ['noTestValue'] })
                        formCtrl = dom.state('forms')[formName]
                        expect(formCtrl).toBeDefined()
                        fieldCtrl = formCtrl.fields[fieldName]
                        expect(fieldCtrl).toBeDefined()
                    })

                    describe(`When the field has "${fieldValue}" value`, () => {

                        it('The form is invalid', () => {
                            expect(formCtrl.valid).toBeFalsy()
                            expect(formCtrl.invalid).toBeTruthy()
                        })

                        it('The field is invalid', () => {
                            expect(fieldCtrl.valid).toBeFalsy()
                            expect(fieldCtrl.invalid).toBeTruthy()
                        })

                        it('The field contains a "noTestValue" error message', () => {
                            expect(fieldCtrl.errors).toContainEqual({ key: 'noTestValue', params: { value: fieldValue } })
                        })

                    })

                })

            })

        })

    })

    describe('The field afterChange interceptor', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        let input
        let fieldCtrl
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} afterChange={_fieldCtrl => fieldCtrl = _fieldCtrl} />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            fieldCtrl = null
            dom.unmount()
        })

        describe('When the field is brand new', () => {

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })


        describe('When the field is changed', () => {

            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue } })
            })

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            it('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            it('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            it('The field still untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

    })

    describe('The field afterBlur interceptor', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        let input
        let fieldCtrl

        function onEvent(_fieldCtrl) {
            fieldCtrl = _fieldCtrl
        }
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} afterChange={onEvent} afterBlur={onEvent} />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            fieldCtrl = null
            dom.unmount()
        })

        describe('When the field is brand new', () => {

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is changed', () => {

            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue } })
            })

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            it('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            it('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            it('The field still untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is blurred', () => {

            beforeEach(() => {
                input.simulate('blur', {})
            })

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is touched', () => {
                expect(fieldCtrl.untouched).toBeFalsy()
                expect(fieldCtrl.touched).toBeTruthy()
            })

        })

    })

    describe('The field afterReset interceptor', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        let input, form
        let fieldCtrl

        function onEvent(_fieldCtrl) {
            fieldCtrl = _fieldCtrl
        }
        
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} afterChange={onEvent} afterReset={onEvent} />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
            form = dom.find('form')
        })

        afterEach(() => {
            fieldCtrl = null
            dom.unmount()
        })

        describe('When the field is brand new', () => {

            beforeEach(() => {
                form.simulate('reset')
            })

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is changed', () => {

            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue } })
                form.simulate('reset')
            })

            it('The fieldCtrl is defined', () => {
                expect(fieldCtrl).toBeDefined()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

    })

    describe('The field interaction behaviour', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue = "testValue"

        let dom
        let input
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            input = null
            dom.unmount()
        })

        describe('When the field is brand new', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            it('The form is empty', () => {
                expect(formCtrl.values[fieldName]).toBe('')
            })

            it('The form is pristine', () => {
                expect(formCtrl.pristine).toBeTruthy()
                expect(formCtrl.dirty).toBeFalsy()
            })

            it('The form is unchanged', () => {
                expect(formCtrl.unchanged).toBeTruthy()
                expect(formCtrl.changed).toBeFalsy()
            })

            it('The form is untouched', () => {
                expect(formCtrl.untouched).toBeTruthy()
                expect(formCtrl.touched).toBeFalsy()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is focused and changed', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', { target: { value: fieldValue } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            it('The form is not empty', () => {
                expect(formCtrl.values[fieldName]).toBe(fieldValue)
            })

            it('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            it('The form is changed', () => {
                expect(formCtrl.unchanged).toBeFalsy()
                expect(formCtrl.changed).toBeTruthy()
            })

            it('The form still untouched', () => {
                expect(formCtrl.untouched).toBeTruthy()
                expect(formCtrl.touched).toBeFalsy()
            })

            it('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            it('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            it('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            it('The field still untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is focused, changed and then blurred', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', { target: { value: fieldValue } })
                input.simulate('blur')
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            it('The form is not empty', () => {
                expect(formCtrl.values[fieldName]).toBe(fieldValue)
            })

            it('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            it('The form is changed', () => {
                expect(formCtrl.unchanged).toBeFalsy()
                expect(formCtrl.changed).toBeTruthy()
            })

            it('The form is touched', () => {
                expect(formCtrl.untouched).toBeFalsy()
                expect(formCtrl.touched).toBeTruthy()
            })

            it('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            it('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            it('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            it('The field is touched', () => {
                expect(fieldCtrl.untouched).toBeFalsy()
                expect(fieldCtrl.touched).toBeTruthy()
            })

        })

        describe('When the field is focused, changed, blurred and then changed back to it\'s initial value', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', { target: { value: fieldValue } })
                input.simulate('blur')

                input.simulate('focus')
                input.simulate('change', { target: { value: '' } })
                input.simulate('blur')
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            it('The form is empty', () => {
                expect(formCtrl.values[fieldName]).toBe('')
            })

            it('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            it('The form is unchanged', () => {
                expect(formCtrl.unchanged).toBeTruthy()
                expect(formCtrl.changed).toBeFalsy()
            })

            it('The form is touched', () => {
                expect(formCtrl.untouched).toBeFalsy()
                expect(formCtrl.touched).toBeTruthy()
            })

            it('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            it('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            it('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            it('The field is touched', () => {
                expect(fieldCtrl.untouched).toBeFalsy()
                expect(fieldCtrl.touched).toBeTruthy()
            })
        })
    })

    describe('The field validation behaviour', () => {

        describe('When the field is required', () => {
            const formName = "testForm"
            const fieldName = "testField"
            const fieldValue = "testValue"

            let dom
            let input
            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper form={formName} name={fieldName} required />
                        </Form>
                    </FormProvider>
                ))
                input = dom.find('input')
            })

            afterEach(() => {
                dom.unmount()
                input = null
            })

            describe('When the field is empty', () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                it('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                it('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                it('The field contains a "required" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({ key: 'required' })
                })
            })

            describe('When the field is not empty', () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue } })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                it('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                it('The field is valid', () => {
                    expect(fieldCtrl.valid).toBeTruthy()
                    expect(fieldCtrl.invalid).toBeFalsy()
                })

                it('The field does not contains errors messages', () => {
                    expect(fieldCtrl.errors).toHaveLength(0)
                })

            })

        })

        describe('When the field is of e-mail type', () => {

            const formName = "testForm"
            const fieldName = "testField"
            const fieldValue1 = "testValue"
            const fieldValue2 = "testValue@test"
            const fieldValue3 = "testValue@test.com"

            let dom
            let input
            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper form={formName} name={fieldName} type="email" />
                        </Form>
                    </FormProvider>
                ))
                input = dom.find('input')
            })

            afterEach(() => {
                dom.unmount()
                input = null
            })

            describe('When the field is empty', () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                it('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                it('The field is valid', () => {
                    expect(fieldCtrl.valid).toBeTruthy()
                    expect(fieldCtrl.invalid).toBeFalsy()
                })

                it('The field does not contains errors messages', () => {
                    expect(fieldCtrl.errors).toHaveLength(0)
                })

            })

            describe(`When the field value is "${fieldValue1}"`, () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue1 } })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                it('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                it('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                it('The field contains a "email" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({ key: 'email', params: { value: fieldValue1 } })
                })

            })

            describe(`When the field value is "${fieldValue2}"`, () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue2 } })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                it('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                it('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                it('The field contains a "email" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({ key: 'email', params: { value: fieldValue2 } })
                })

            })

            describe(`When the field value is "${fieldValue3}"`, () => {

                let formCtrl
                beforeEach(() => {
                    input.simulate('change', { target: { value: fieldValue3 } })
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                })

                it('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                it('The field is valid with no errors messages', () => {
                    const fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl.valid).toBeTruthy()
                    expect(fieldCtrl.invalid).toBeFalsy()
                    expect(fieldCtrl.errors).toHaveLength(0)
                })

            })

        })

    })

    describe('When the field is of number type and not integer', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue1 = "testValue"
        const fieldValue2 = "1.5"
        const fieldValue3 = "1"

        let dom
        let input
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} type="number" />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            dom.unmount()
            input = null
        })

        describe('When the field is empty', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            it('The field does not contains errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })


        describe(`When the field value is "${fieldValue1}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            it('The field contains a "float" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({ key: 'float', params: { value: fieldValue1 } })
            })

        })

        describe(`When the field value is "${fieldValue2}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue2 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            it('The field does not contains errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })

        describe(`When the field value is "${fieldValue3}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue3 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            it('The field does not contains errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })

    })

    describe('When the field is of number type and is integer', () => {

        const formName = "testForm"
        const fieldName = "testField"
        const fieldValue1 = "testValue"
        const fieldValue2 = "1.5"
        const fieldValue3 = "1"

        let dom
        let input
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <InputWrapper form={formName} name={fieldName} type="number" integer />
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            dom.unmount()
            input = null
        })

        describe('When the field is empty', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            it('The field does not contains errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })


        describe(`When the field value is "${fieldValue1}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            it('The field contains a "integer" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({ key: 'integer', params: { value: fieldValue1 } })
            })

        })

        describe(`When the field value is "${fieldValue2}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue2 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            it('The field contains a "integer" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({ key: 'integer', params: { value: fieldValue2 } })
            })

        })

        describe(`When the field value is "${fieldValue3}"`, () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', { target: { value: fieldValue3 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            it('The field has no errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })

    })

    describe('When the field is of date type', () => {

        const dateValue = new Date();
        const formName = "testForm"
        const fieldName = "testField"

        let dom
        let input
        let formCtrl
        let fieldCtrl

        describe('With a date type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="date"
                                initialValue={dateValue}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                formCtrl = null
                fieldCtrl = null
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDate(dateValue))
                expect(fieldCtrl.value).toBe(formatDate(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('With a date string type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="date"
                                initialValue={formatDate(dateValue)}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                formCtrl = null
                fieldCtrl = null
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDate(dateValue))
                expect(fieldCtrl.value).toBe(formatDate(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('With a date numbet type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="date"
                                initialValue={dateValue.getTime()}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                formCtrl = null
                fieldCtrl = null
                dom.unmount()
            })


            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDate(dateValue))
                expect(fieldCtrl.value).toBe(formatDate(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('When field value changes', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="date"
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                formCtrl = null
                fieldCtrl = null
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                input.simulate('change', {target: {value: formatDate(dateValue)}})
                expect(fieldCtrl.value).toBe(formatDate(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                input.simulate('change', {target: {value: formatDate(dateValue)}})
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })
    })

    describe('When the field is of datetime-local type', () => {

        const dateValue = new Date();
        const formName = "testForm"
        const fieldName = "testField"

        let dom
        let input
        let formCtrl
        let fieldCtrl

        describe('With a date type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="datetime-local"
                                initialValue={dateValue}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDateTime(dateValue))
                expect(fieldCtrl.value).toBe(formatDateTime(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('With a date string type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="datetime-local"
                                initialValue={formatDateTime(dateValue)}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDateTime(dateValue))
                expect(fieldCtrl.value).toBe(formatDateTime(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('With a date numbet type initialValue', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="datetime-local"
                                initialValue={dateValue.getTime()}
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                expect(formCtrl.fields[fieldName].value).toBe(formatDateTime(dateValue))
                expect(fieldCtrl.value).toBe(formatDateTime(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

        describe('When field value changes', () => {

            beforeEach(() => {
                dom = mount((
                    <FormProvider>
                        <Form name={formName}>
                            <InputWrapper 
                                form={formName} 
                                name={fieldName} 
                                type="datetime-local"
                            />
                        </Form>
                    </FormProvider>
                ))
                formCtrl = dom.state('forms')[formName]
                fieldCtrl = formCtrl.fields[fieldName]
                input = dom.find('input')
            })

            afterEach(() => {
                dom.unmount()
            })

            it('The field value in form controller is of date string type', () =>{
                input.simulate('change', {target: {value: formatDateTime(dateValue)}})
                expect(fieldCtrl.value).toBe(formatDateTime(dateValue))
            })

            it('The field value in form controller is of Date type', () =>{
                input.simulate('change', {target: {value: formatDateTime(dateValue)}})
                expect(formCtrl.values[fieldName]).toBeInstanceOf(Date)
            })
        })

    })

    describe('When the field has match validation', () => {

        const formName = "testForm"
        const fieldName1 = "testField1"
        const fieldName2 = "testField2"


        const fieldValue1 = "testValue"
        const fieldValue2 = "testValue2"

        let dom
        let input1
        let input2

        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}>
                        <div>
                            <InputWrapper form={formName} className={fieldName1} name={fieldName1} required />
                            <InputWrapper form={formName} className={fieldName2} name={fieldName2} match={fieldName1} required />
                        </div>
                    </Form>
                </FormProvider>
            ))
            input1 = dom.find(`input.${fieldName1}`)
            input2 = dom.find(`input.${fieldName2}`)
        })

        afterEach(() => {
            dom.unmount()
        })

        describe('When both fields are empty', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" is invalid`, () => {
                expect(fieldCtrl1.valid).toBeFalsy()
                expect(fieldCtrl1.invalid).toBeTruthy()
            })

            it(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" contains "required" error message.`, () => {
                expect(fieldCtrl1.errors).toContainEqual({ key: 'required' })
            })

            it(`The field "${fieldName2}" contains "required" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({ key: 'required' })
            })

        })

        describe('When only the first field are not empty', () => {
            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            it(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            it(`The field "${fieldName2}" contains "required" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({ key: 'required' })
            })
        })

        describe('When only the seccond field are not empty', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input2.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" is invalid`, () => {
                expect(fieldCtrl1.valid).toBeFalsy()
                expect(fieldCtrl1.invalid).toBeTruthy()
            })

            it(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" contains "required" error message.`, () => {
                expect(fieldCtrl1.errors).toContainEqual({ key: 'required' })
            })

            it(`The field "${fieldName2}" contains "match" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({ key: 'match', params: { value: fieldValue1, match: fieldName1 } })
            })
        })

        describe('When both fields has different values', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', { target: { value: fieldValue1 } })
                input2.simulate('change', { target: { value: fieldValue2 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            it(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            it(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            it(`The field "${fieldName2}" contains "match" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({ key: 'match', params: { value: fieldValue2, match: fieldName1 } })
            })

        })

        describe('When both fields are not empty and have the same value', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', { target: { value: fieldValue1 } })
                input2.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            it(`The field "${fieldName2}" is valid`, () => {
                expect(fieldCtrl2.valid).toBeTruthy()
                expect(fieldCtrl2.invalid).toBeFalsy()
            })

            it(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            it(`The field "${fieldName2}" has no errors messages.`, () => {
                expect(fieldCtrl2.errors).toHaveLength(0)
            })

        })

        describe('When the confirmation field is changed before the matched field', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input2.simulate('change', { target: { value: fieldValue1 } })
                input1.simulate('change', { target: { value: fieldValue1 } })
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            it('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            it(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            it(`The field "${fieldName2}" is valid`, () => {
                expect(fieldCtrl2.valid).toBeTruthy()
                expect(fieldCtrl2.invalid).toBeFalsy()
            })

            it(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            it(`The field "${fieldName2}" has no errors messages.`, () => {
                expect(fieldCtrl2.errors).toHaveLength(0)
            })

        })

    })

})