import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, Field} from '../src'

import {inputInject} from '../tests-utils'

configure({adapter: new Adapter()})

describe('About the FormProvider component', () => {

    describe('The Form registration behaviour', () => {

        const formName = 'testForm'

        let dom
        beforeEach(() => {
            dom = mount((
                <FormProvider>
                    <Form name={formName}></Form>
                </FormProvider>
            ))
        })

        describe('When Form is registered', () => {
            
            test(`A Form instance named "${formName}" exists`, () => {
                const formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeDefined()
            })

            test('The Form instance has formName property', () => {
                const formCtrl = dom.state('forms')[formName]
                expect(formCtrl.formName).toBe(formName)
            })

            test('The Form instance has no fields', () => {
                const formCtrl = dom.state('forms')[formName]
                expect(Object.keys(formCtrl.fields)).toHaveLength(0)
            })

            test('The Form instance has no values', () => {
                const formCtrl = dom.state('forms')[formName]
                expect(Object.keys(formCtrl.values)).toHaveLength(0)
            })

            test('The Form instance has no files', () => {
                const formCtrl = dom.state('forms')[formName]
                expect(Object.keys(formCtrl.files)).toHaveLength(0)
            })

        })

        describe('When Form is unregistered', () => {

            beforeEach(() => {
                dom.setProps({children: null})
                dom.update()
            })

            test(`A Form instance named "${formName}" does not exists`, () => {
                const formCtrl = dom.state('forms')[formName]
                expect(formCtrl).toBeUndefined()
            })

        })

    })

    describe('The Field registration behaviour', () => {
        const formName = 'testForm'
        const fieldName = 'testField'
        
        let dom
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
        })

        describe('When Field is registered', () => {

            test(`The Form instance has a field named "${fieldName}"`, () => {
                const formCtrl = dom.state('forms')[formName]
                expect(Object.keys(formCtrl.fields)).toContain(fieldName)
            })

            test(`The Form instance has a value entry named "${fieldName}"`, () => {
                const formCtrl = dom.state('forms')[formName]
                expect(Object.keys(formCtrl.values)).toContain(fieldName)
            })
        })

        // describe('When Field is unregistered', () => {
            
        //     beforeEach(() => {
        //         const field = dom.find(Field).detach()
        //         field.setProps({children: null})
        //         field.update()
        //     })

        //     test(`The Form instance has not a field named "${fieldName}"`, () => {
        //         const formCtrl = dom.state('forms')[formName]
        //         expect(Object.keys(formCtrl.fields)).toHaveLength(0)
        //     })

        //     test(`The Form instance has not a value entry named "${fieldName}"`, () => {
        //         const formCtrl = dom.state('forms')[formName]
        //         expect(Object.keys(formCtrl.values)).toHaveLength(0)
        //     })
        // })

    })

})