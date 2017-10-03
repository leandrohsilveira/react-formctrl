import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, Field} from '../src'

import {inputInject} from '../tests-utils'

configure({adapter: new Adapter()})

describe('About the Field component', () => {

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
                        <Field form={formName} name={fieldName} inject={inputInject}>
                            <input />
                        </Field>
                    </Form>
                </FormProvider>
            ))
            input = dom.find('input')
        })

        afterEach(() => {
            dom.unmount()
            input = null
        })


        describe('When the field is brand new', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            test('The form is empty', () => {
                expect(formCtrl.values[fieldName]).toBe('')
            })

            test('The form is pristine', () => {
                expect(formCtrl.pristine).toBeTruthy()
                expect(formCtrl.dirty).toBeFalsy()
            })

            test('The form is unchanged', () => {
                expect(formCtrl.unchanged).toBeTruthy()
                expect(formCtrl.changed).toBeFalsy()
            })

            test('The form is untouched', () => {
                expect(formCtrl.untouched).toBeTruthy()
                expect(formCtrl.touched).toBeFalsy()
            })

            test('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            test('The field is pristine', () => {
                expect(fieldCtrl.pristine).toBeTruthy()
                expect(fieldCtrl.dirty).toBeFalsy()
            })

            test('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            test('The field is untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is focused and changed', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', {target: {value: fieldValue}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            test('The form is not empty', () => {
                expect(formCtrl.values[fieldName]).toBe(fieldValue)
            })

            test('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            test('The form is changed', () => {
                expect(formCtrl.unchanged).toBeFalsy()
                expect(formCtrl.changed).toBeTruthy()
            })

            test('The form still untouched', () => {
                expect(formCtrl.untouched).toBeTruthy()
                expect(formCtrl.touched).toBeFalsy()
            })
            
            test('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            test('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            test('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            test('The field still untouched', () => {
                expect(fieldCtrl.untouched).toBeTruthy()
                expect(fieldCtrl.touched).toBeFalsy()
            })

        })

        describe('When the field is focused, changed and then blurred', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', {target: {value: fieldValue}})
                input.simulate('blur')
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            test('The form is not empty', () => {
                expect(formCtrl.values[fieldName]).toBe(fieldValue)
            })

            test('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            test('The form is changed', () => {
                expect(formCtrl.unchanged).toBeFalsy()
                expect(formCtrl.changed).toBeTruthy()
            })

            test('The form is touched', () => {
                expect(formCtrl.untouched).toBeFalsy()
                expect(formCtrl.touched).toBeTruthy()
            })
            
            test('The field is not empty', () => {
                expect(fieldCtrl.value).toBe(fieldValue)
            })

            test('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            test('The field is changed', () => {
                expect(fieldCtrl.unchanged).toBeFalsy()
                expect(fieldCtrl.changed).toBeTruthy()
            })

            test('The field is touched', () => {
                expect(fieldCtrl.untouched).toBeFalsy()
                expect(fieldCtrl.touched).toBeTruthy()
            })

        })

        describe('When the field is focused, changed, blurred and then changed back to it\'s initial value', () => {

            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('focus')
                input.simulate('change', {target: {value: fieldValue}})
                input.simulate('blur')

                input.simulate('focus')
                input.simulate('change', {target: {value: ''}})
                input.simulate('blur')
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test(`The form is named "${formName}"`, () => {
                expect(formCtrl.formName).toBe(formName)
            })

            test('The form is empty', () => {
                expect(formCtrl.values[fieldName]).toBe('')
            })

            test('The form is dirty', () => {
                expect(formCtrl.pristine).toBeFalsy()
                expect(formCtrl.dirty).toBeTruthy()
            })

            test('The form is unchanged', () => {
                expect(formCtrl.unchanged).toBeTruthy()
                expect(formCtrl.changed).toBeFalsy()
            })

            test('The form is touched', () => {
                expect(formCtrl.untouched).toBeFalsy()
                expect(formCtrl.touched).toBeTruthy()
            })

            test('The field is empty', () => {
                expect(fieldCtrl.value).toBe('')
            })

            test('The field is dirty', () => {
                expect(fieldCtrl.pristine).toBeFalsy()
                expect(fieldCtrl.dirty).toBeTruthy()
            })

            test('The field is unchanged', () => {
                expect(fieldCtrl.unchanged).toBeTruthy()
                expect(fieldCtrl.changed).toBeFalsy()
            })

            test('The field is touched', () => {
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
                            <Field form={formName} name={fieldName} inject={inputInject} required>
                                <input />
                            </Field>
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

                test('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                test('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                test('The field contains a "required" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({key: 'required'})
                })
            })

            describe('When the field is not empty', () => {
                
                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', {target: {value: fieldValue}})
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                test('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                test('The field is valid', () => {
                    expect(fieldCtrl.valid).toBeTruthy()
                    expect(fieldCtrl.invalid).toBeFalsy()
                })

                test('The field does not contains errors messages', () => {
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
                            <Field form={formName} name={fieldName} inject={inputInject} type="email">
                                <input />
                            </Field>
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

                test('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                test('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                test('The field contains a "email" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: ''}})
                })

            })

            describe(`When the field value is "${fieldValue1}"`, () => {

                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', {target: {value: fieldValue1}})
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                test('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                test('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                test('The field contains a "email" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: fieldValue1}})
                })

            })

            describe(`When the field value is "${fieldValue2}"`, () => {
                
                let formCtrl, fieldCtrl
                beforeEach(() => {
                    input.simulate('change', {target: {value: fieldValue2}})
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                    fieldCtrl = formCtrl.fields[fieldName]
                    expect(fieldCtrl).toBeDefined()
                })

                test('The form is invalid', () => {
                    expect(formCtrl.valid).toBeFalsy()
                    expect(formCtrl.invalid).toBeTruthy()
                })

                test('The field is invalid', () => {
                    expect(fieldCtrl.valid).toBeFalsy()
                    expect(fieldCtrl.invalid).toBeTruthy()
                })

                test('The field contains a "email" error message', () => {
                    expect(fieldCtrl.errors).toContainEqual({key: 'email', params: {value: fieldValue2}})
                })

            })

            describe(`When the field value is "${fieldValue3}"`, () => {
                
                let formCtrl
                beforeEach(() => {
                    input.simulate('change', {target: {value: fieldValue3}})
                    formCtrl = dom.state('forms')[formName]
                    expect(formCtrl).toBeDefined()
                })

                test('The form is valid', () => {
                    expect(formCtrl.valid).toBeTruthy()
                    expect(formCtrl.invalid).toBeFalsy()
                })

                test('The field is valid with no errors messages', () => {
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
                        <Field form={formName} name={fieldName} inject={inputInject} type="number">
                            <input />
                        </Field>
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

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            test('The field contains a "float" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({key: 'float', params: {value: ''}})
            })

        })


        describe(`When the field value is "${fieldValue1}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue1}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            test('The field contains a "float" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({key: 'float', params: {value: fieldValue1}})
            })

        })

        describe(`When the field value is "${fieldValue2}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue2}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            test('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })
            
            test('The field does not contains errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
            })

        })

        describe(`When the field value is "${fieldValue3}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue3}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            test('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })

            test('The field does not contains errors messages', () => {
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
                        <Field form={formName} name={fieldName} inject={inputInject} type="number" integer>
                            <input />
                        </Field>
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

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })
            test('The field contains a "integer" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: ''}})
            })

        })


        describe(`When the field value is "${fieldValue1}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue1}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            test('The field contains a "integer" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: fieldValue1}})
            })

        })

        describe(`When the field value is "${fieldValue2}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue2}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test('The field is invalid', () => {
                expect(fieldCtrl.valid).toBeFalsy()
                expect(fieldCtrl.invalid).toBeTruthy()
            })

            test('The field contains a "integer" error message', () => {
                expect(fieldCtrl.errors).toContainEqual({key: 'integer', params: {value: fieldValue2}})
            })

        })

        describe(`When the field value is "${fieldValue3}"`, () => {
            
            let formCtrl, fieldCtrl
            beforeEach(() => {
                input.simulate('change', {target: {value: fieldValue3}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl = formCtrl.fields[fieldName]
                expect(fieldCtrl).toBeDefined()
            })

            test('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            test('The field is valid', () => {
                expect(fieldCtrl.valid).toBeTruthy()
                expect(fieldCtrl.invalid).toBeFalsy()
            })
            
            test('The field has no errors messages', () => {
                expect(fieldCtrl.errors).toHaveLength(0)
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
            input1 = dom.find(`input.${fieldName1}`)
            input2 = dom.find(`input.${fieldName2}`)
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

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" is invalid`, () => {
                expect(fieldCtrl1.valid).toBeFalsy()
                expect(fieldCtrl1.invalid).toBeTruthy()
            })

            test(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" contains "required" error message.`, () => {
                expect(fieldCtrl1.errors).toContainEqual({key: 'required'})
            })

            test(`The field "${fieldName2}" contains "required" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({key: 'required'})
            })

        })

        describe('When only the first field are not empty', () => {
            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', {target: {value: fieldValue1}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            test(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            test(`The field "${fieldName2}" contains "required" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({key: 'required'})
            })
        })

        describe('When only the seccond field are not empty', () => {

            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input2.simulate('change', {target: {value: fieldValue1}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" is invalid`, () => {
                expect(fieldCtrl1.valid).toBeFalsy()
                expect(fieldCtrl1.invalid).toBeTruthy()
            })

            test(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" contains "required" error message.`, () => {
                expect(fieldCtrl1.errors).toContainEqual({key: 'required'})
            })

            test(`The field "${fieldName2}" contains "match" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({key: 'match', params: {value: fieldValue1, match: fieldName1}})
            })
        })

        describe('When both fields has different values', () => {
            
            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', {target: {value: fieldValue1}})
                input2.simulate('change', {target: {value: fieldValue2}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            test('The form is invalid', () => {
                expect(formCtrl.valid).toBeFalsy()
                expect(formCtrl.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            test(`The field "${fieldName2}" is invalid`, () => {
                expect(fieldCtrl2.valid).toBeFalsy()
                expect(fieldCtrl2.invalid).toBeTruthy()
            })

            test(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            test(`The field "${fieldName2}" contains "match" error message.`, () => {
                expect(fieldCtrl2.errors).toContainEqual({key: 'match', params: {value: fieldValue2, match: fieldName1}})
            })

        })

        describe('When both fields are not empty and have the same value', () => {
            
            let formCtrl, fieldCtrl1, fieldCtrl2
            beforeEach(() => {
                input1.simulate('change', {target: {value: fieldValue1}})
                input2.simulate('change', {target: {value: fieldValue1}})
                formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
                fieldCtrl1 = formCtrl.fields[fieldName1]
                expect(fieldCtrl1).toBeDefined()
                fieldCtrl2 = formCtrl.fields[fieldName2]
                expect(fieldCtrl2).toBeDefined()
            })

            test('The form is valid', () => {
                expect(formCtrl.valid).toBeTruthy()
                expect(formCtrl.invalid).toBeFalsy()
            })

            test(`The field "${fieldName1}" is valid`, () => {
                expect(fieldCtrl1.valid).toBeTruthy()
                expect(fieldCtrl1.invalid).toBeFalsy()
            })

            test(`The field "${fieldName2}" is valid`, () => {
                expect(fieldCtrl2.valid).toBeTruthy()
                expect(fieldCtrl2.invalid).toBeFalsy()
            })

            test(`The field "${fieldName1}" has no errors messages.`, () => {
                expect(fieldCtrl1.errors).toHaveLength(0)
            })

            test(`The field "${fieldName2}" has no errors messages.`, () => {
                expect(fieldCtrl2.errors).toHaveLength(0)
            })
            
        })

    })
    
})

