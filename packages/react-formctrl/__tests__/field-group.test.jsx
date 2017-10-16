import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';
import {FormProvider, Form, FieldArray, FieldArrayEntry, Field} from '../src'

import {inputInject} from './field.test'

configure({adapter: new Adapter()})

const formName = 'testForm'
const fieldName1 = 'testField1'
const fieldName2 = 'testField2'
const fieldArrayName = 'testFieldArray'
const fieldArrayField1 = 'testFieldArrayField1'
const fieldArrayField2 = 'testFieldArrayField2'

function provide(fieldArray) {


    const dom = mount((
        <FormProvider>
            <Form name={formName}>

                <Field form={formName} name={fieldName1} inject={inputInject}>
                    <input />
                </Field>
                <Field form={formName} name={fieldName2} inject={inputInject}>
                    <input />
                </Field>

                {fieldArray}

            </Form>
        </FormProvider>
    ))

    const formCtrl = dom.state('forms')[formName]
    return {
        dom, formCtrl
    }

}

function FieldsGroup({form, name, startEmpty}) {
    return (
        <FieldArray form={form} name={name} startEmpty={startEmpty} render={({ctrls, pushEntry}) => (
            <div>
                {ctrls.map(({entry, removeEntry}, index) => (
                    <div key={index}>
                        <FieldArrayEntry entry={entry} name={fieldArrayField1} inject={inputInject}>
                            <input className={`input-${fieldArrayField1}-${index}`} />
                        </FieldArrayEntry>
                        <FieldArrayEntry entry={entry} name={fieldArrayField2} inject={inputInject}>
                            <input className={`input-${fieldArrayField2}-${index}`} />
                        </FieldArrayEntry>
                        <button className={`btn-remove-entry-${index}`} type="button" onClick={() => removeEntry()}>Remove</button>        
                    </div>
                ))}
                <button className="btn-push-entry" type="button" onClick={() => pushEntry()}>Add</button>        
            </div>
        )} />
    )
}

describe('About <FieldArray/> component', () => {


    describe('The <FieldArray/> registration', () => {

 


        describe('When the FieldArray starts with an empty entry (default behaviour)', () => {
            let dom, formCtrl
            beforeEach(() => {
    
                const provider = provide((
                    <FieldsGroup form={formName} name={fieldArrayName} />
                ))
                expect(provider).toBeDefined()
                expect(provider.dom).toBeDefined()
                expect(provider.formCtrl).toBeDefined()

                dom = provider.dom
                formCtrl = provider.formCtrl

            })

            test('FormCtrl contains an array with an empty entry on values property', () => {

                expect(formCtrl.values).toEqual({[fieldName1]: '', [fieldName2]: '', [fieldArrayName]: [{[fieldArrayField1]: '', [fieldArrayField2]: ''}]})

            })

            test('FormCtrl contains an array with an brand new FieldCtrl entry on fields property', () => {
                const fieldArrayCtrls = formCtrl.fields[fieldArrayName]
                expect(fieldArrayCtrls).toBeInstanceOf(Array)
                expect(fieldArrayCtrls).toHaveLength(1)
                
                const fieldArrayEntryCtrl = fieldArrayCtrls[0]
                expect(fieldArrayEntryCtrl).toHaveProperty(fieldArrayField1)
                expect(fieldArrayEntryCtrl).toHaveProperty(fieldArrayField2)
                expect(fieldArrayEntryCtrl[fieldArrayField1].value).toBe('')
                expect(fieldArrayEntryCtrl[fieldArrayField2].value).toBe('')

                expect(formCtrl.values).toEqual({[fieldName1]: '', [fieldName2]: '', [fieldArrayName]: [{[fieldArrayField1]: '', [fieldArrayField2]: ''}]})
                
            })


        })


        

    })


})