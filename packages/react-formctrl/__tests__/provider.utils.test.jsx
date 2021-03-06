import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import {mount, configure} from 'enzyme';

import {FormProvider, Form, Field} from '../src'

import {inputInject} from './field.test'

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
    copyFormValues,
    compareFieldProps,
    compareArrays,
    ensureStringValue,
    formatDate,
    formatDateTime
} from '../src/provider/provider.utils'

configure({adapter: new Adapter()})

describe('The provider.utils module', () => {

    function MockFileList(files) {
        const thiz = this
        thiz.files = files
        return {
            length: thiz.files.length,
            item: (i) => thiz.files[i],
        }
    }

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
    
    describe('The copyFiles() function', () => {

        describe('When a FileList is provided', () => {

            test('Then the return type is an array', () => {
                const result = copyFiles(new MockFileList(['a', 'b']));
                expect(result).toBeInstanceOf(Array)
                expect(result).toEqual(['a', 'b'])

            })

        })

        describe('When a Array is provided', () => {

            test('Then the return type is an array', () => {
                const result = copyFiles(['a', 'b']);
                expect(result).toBeInstanceOf(Array)
                expect(result).toEqual(['a', 'b'])
            })

        })


    })

    describe('The formatDate() function', () => {

        const dateValue1 = new Date(2018, 0, 1)
        const stringValue1 = '2018-01-01'
        const dateValue2 = new Date(2018, 10, 10)
        const stringValue2 = '2018-11-10'
        
        describe('When the provided value is a date', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDate(dateValue1)
                expect(response1).toEqual(stringValue1)

                const response2 = formatDate(dateValue2)
                expect(response2).toEqual(stringValue2)

            })

        })

        describe('When the provided value is a string date format', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDate(stringValue1)
                expect(response1).toEqual(stringValue1)

                const response2 = formatDate(stringValue2)
                expect(response2).toEqual(stringValue2)

            })

        })

        describe('When the provided value is a string non-date format', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDate(1)
                expect(response1).toEqual(1)

            })

        })

        describe('When the provided value is null', () => {

            test('Then the own null value is returned', () => {

                const response1 = formatDate(null)
                expect(response1).toBeNull()

            })

        })

    })

    describe('The formatDateTime() function', () => {

        const dateValue1 = new Date(2018, 0, 1, 1, 1)
        const stringValue1 = '2018-01-01T01:01'
        const dateValue2 = new Date(2018, 10, 10, 10, 10)
        const stringValue2 = '2018-11-10T10:10'
        
        describe('When the provided value is a date', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDateTime(dateValue1)
                expect(response1).toEqual(stringValue1)

                const response2 = formatDateTime(dateValue2)
                expect(response2).toEqual(stringValue2)

            })

        })

        describe('When the provided value is a string date format', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDateTime(stringValue1)
                expect(response1).toEqual(stringValue1)

                const response2 = formatDateTime(stringValue2)
                expect(response2).toEqual(stringValue2)

            })

        })

        describe('When the provided value is a string non-date format', () => {

            test('Then a string value of the date is returned', () => {

                const response1 = formatDateTime(1)
                expect(response1).toEqual(1)

            })

        })

        describe('When the provided value is null', () => {

            test('Then the own null value is returned', () => {

                const response1 = formatDateTime(null)
                expect(response1).toBeNull()

            })

        })

    })

    describe('The ensureStringValue() function', () => {

        describe('When the type is date', () => {

            const type = 'date'
            const dateValue = new Date()
            const stringValue = formatDate(dateValue)
            const numberValue = dateValue.getTime()
            const invalidStringValue = 'test'
            const invalidNumberValue = -9999999999999999.588

            describe('And a date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(dateValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a valid string date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(stringValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a valid number date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(numberValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a invalid string date value is provided', () => {

                test('An error is thrown', () => {
                    expect(() => {
                        ensureStringValue(invalidStringValue, type)
                    })
                    .toThrow(`The value "${invalidStringValue}" provided can't be parsed to date type.`)
                })

            })

            describe('And a invalid number date value is provided', () => {

                test('An error is thrown', () => {
                    expect(() => {
                        const response = ensureStringValue(invalidNumberValue, type)
                        console.log(response)
                    })
                    .toThrow(`The value "${invalidNumberValue}" provided can't be parsed to date type.`)
                })

            })

        })

        describe('When the type is datetime-local', () => {

            const type = 'datetime-local'
            const dateValue = new Date()
            const stringValue = formatDateTime(dateValue)
            const numberValue = dateValue.getTime()
            const invalidStringValue = 'test'
            const invalidNumberValue = -9999999999999999.588

            describe('And a date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(dateValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a valid string date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(stringValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a valid number date value is provided', () => {

                test('Then a string value of the date is returned', () => {
                    const response = ensureStringValue(numberValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

            describe('And a invalid string date value is provided', () => {

                test('An error is thrown', () => {
                    expect(() => {
                        ensureStringValue(invalidStringValue, type)
                    })
                    .toThrow(`The value "${invalidStringValue}" provided can't be parsed to date type.`)
                })

            })

            describe('And a invalid number date value is provided', () => {

                test('An error is thrown', () => {
                    expect(() => {
                        const response = ensureStringValue(invalidNumberValue, type)
                        console.log(response)
                    })
                    .toThrow(`The value "${invalidNumberValue}" provided can't be parsed to date type.`)
                })

            })

        })

        describe('When the type is text', () => {

            const type = 'text'
            const dateValue = new Date()
            const stringValue = formatDateTime(dateValue)

            describe('And a date value is provided', () => {

                test('Then the own date value is returned', () => {
                    const response = ensureStringValue(dateValue, type)
                    expect(response).toEqual(dateValue)
                })

            })

            describe('And a valid string date value is provided', () => {

                test('Then the own string value is returned', () => {
                    const response = ensureStringValue(stringValue, type)
                    expect(response).toEqual(stringValue)
                })

            })

        })

    })
    
    describe('The copyArray() function', () => {

        test('With a defined array', () => {
            const array = ['test']
            const newArray = copyArray(array)
            expect(newArray).not.toBe(array)
            expect(newArray).toEqual(array)
        })

        test('With a undefined array', () => {
            const array = []
            const newArray = copyArray()
            expect(newArray).not.toBe(array)
            expect(newArray).toEqual(array)
        })

    })
    
    test('The copyFieldCtrlProps() function', () => {
        const props = fieldCtrl.props

        const newProps = copyFieldCtrlProps(props)

        expect(newProps).not.toBe(props)
        expect(newProps).toEqual(props)
    })
    
    describe('The copyError() function', () => {

        describe('When has only a key prop', () => {

            test('The provided reference is not the same returned (copied)', () => {
                const error = {key: 'test'}
                const newError = copyError(error)
                expect(newError).not.toBe(error)
                expect(newError).toEqual(error)
            })

        })

        describe('When has a string param', () => {

            test('The provided reference is not the same returned (copied)', () => {
                const error = {key: 'test', params: {testParamName: 'testParamValue'}}
                const newError = copyError(error)
                expect(newError).not.toBe(error)
                expect(newError).toEqual(error)
            })
        })

        describe('When has an array param', () => {

            test('The provided reference is not the same returned (copied)', () => {
                const error = {key: 'test', params: {testParamName: ['testParamValue']}}
                const newError = copyError(error)
                expect(newError).not.toBe(error)
                expect(newError).toEqual(error)
            })

        })

        describe('When has a FileList param', () => {
            test('The provided reference is not the same returned (copied)', () => {
                const error = {key: 'test', params: {testParamName: new MockFileList(['testParamValue'])}}
                const expected = {key: 'test', params: {testParamName: ['testParamValue']}}
                const newError = copyError(error)
                expect(newError).not.toBe(error)
                expect(newError).toEqual(expected)
            })
        })

    })
    
    describe('The copyErrors() function', () => {
        
        test('Component field errors copy', () => {
            const errors = fieldCtrl.errors
            
            const newErrors = copyErrors(errors)
    
            expect(newErrors).not.toBe(errors)
            expect(newErrors).toEqual(errors)
        })

        test('When an error has an array param', () => {

            const errors = [{key: 'test', params: {value: 'test', arr: ['test']}}]
            const newErrors = copyErrors(errors)
            
            expect(newErrors).not.toBe(errors)
            expect(newErrors).toEqual(errors)
        })

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

    describe('The compareFieldProps() function', () => {
        
        const fieldName = 'testName'
        const formName = 'testForm'

        test('When both props are the same object', () => {

            const props1 = {name: fieldName}
            const props2 = props1

            const result = compareFieldProps(props1, props2)
            expect(result).toBeTruthy()

        })

        describe('About the name prop', () => {
            
            test('When the values are different', () => {

                const props1 = {name: fieldName}
                const props2 = {name: 'test'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the form prop', () => {
            
            test('When the values are different', () => {

                const props1 = {form: formName}
                const props2 = {form: 'test'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the type prop', () => {
            
            test('When the values are different', () => {

                const props1 = {type: formName}
                const props2 = {type: 'test'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the required prop', () => {
            
            test('When the values are different', () => {

                const props1 = {required: true}
                const props2 = {required: false}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the pattern prop', () => {
            
            const pattern = /\d+/

            test('When the pattern is the same object instance', () => {
                const props1 = {pattern: pattern}
                const props2 = {pattern: pattern}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()
            })

            test('When the pattern is the same object instance', () => {
                const props1 = {pattern: pattern}
                const props2 = {pattern: pattern}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()
            })

            test('When the patterns are equals but with different instances', () => {
                
                const props1 = {pattern: pattern}
                const props2 = {pattern: /\d+/}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are different', () => {
                
                const props1 = {pattern: pattern}
                const props2 = {pattern: /\D+/}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })
            
        })

        describe('About the match prop', () => {
            
            test('When the values are different', () => {

                const props1 = {match: 'match1'}
                const props2 = {match: 'match2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the min prop', () => {

            test('When the values are equals', () => {
                
                const props1 = {min: 1}
                const props2 = {min: 1}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are equals, but with different types', () => {
                
                const props1 = {min: 1}
                const props2 = {min: '1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are different', () => {

                const props1 = {min: '1'}
                const props2 = {min: '2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the max prop', () => {
            
            test('When the values are equals', () => {
                
                const props1 = {max: 1}
                const props2 = {max: 1}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are equals, but with different types', () => {
                
                const props1 = {max: 1}
                const props2 = {max: '1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are different', () => {

                const props1 = {max: '1'}
                const props2 = {max: '2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the minLength prop', () => {
            
            test('When the values are equals', () => {
                
                const props1 = {minLength: 1}
                const props2 = {minLength: 1}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are equals, but with different types', () => {
                
                const props1 = {minLength: 1}
                const props2 = {minLength: '1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are different', () => {

                const props1 = {minLength: '1'}
                const props2 = {minLength: '2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the maxLength prop', () => {
            
            test('When the values are equals', () => {
                
                const props1 = {maxLength: 1}
                const props2 = {maxLength: 1}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are equals, but with different types', () => {
                
                const props1 = {maxLength: 1}
                const props2 = {maxLength: '1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are different', () => {

                const props1 = {maxLength: '1'}
                const props2 = {maxLength: '2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the accept prop', () => {
            
            test('When the values are different', () => {

                const props1 = {accept: 'accept1'}
                const props2 = {accept: 'accept2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

        describe('About the extensions prop', () => {

            test('When the values are the same instance', () => {
                const extensions = ['ext1']
                const props1 = {extensions}
                const props2 = {extensions}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are equals arrays', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: ['ext1']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are different arrays with same length', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: ['ext2']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the values are different arrays with different length', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: ['ext1', 'ext2']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the first array is null', () => {
                
                const props1 = {extensions: undefined}
                const props2 = {extensions: ['ext1']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the seccond array is null', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: undefined}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the values are equals', () => {
                
                const props1 = {extensions: 'ext1'}
                const props2 = {extensions: 'ext1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are different', () => {

                const props1 = {extensions: 'ext1'}
                const props2 = {extensions: 'ext2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the first value is array, and the seccond is string', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: 'ext1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the seccond value is array, and the first is string', () => {
                
                const props1 = {extensions: 'ext1'}
                const props2 = {extensions: ['ext1']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the first value is array, and the seccond is object', () => {
                
                const props1 = {extensions: ['ext1']}
                const props2 = {extensions: {ext: 'ext1'}}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

            test('When the seccond value is array, and the first is object', () => {
                
                const props1 = {extensions: {ext: 'ext1'}}
                const props2 = {extensions: ['ext1']}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

                    })

        describe('About the maxSize prop', () => {
            
            test('When the values are equals', () => {
                
                const props1 = {maxSize: 1}
                const props2 = {maxSize: 1}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })

            test('When the values are equals, but with different types', () => {
                
                const props1 = {maxSize: 1}
                const props2 = {maxSize: '1'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeTruthy()

            })
            
            test('When the values are different', () => {

                const props1 = {maxSize: '1'}
                const props2 = {maxSize: '2'}

                const result = compareFieldProps(props1, props2)
                expect(result).toBeFalsy()

            })

        })

    })

    describe('The compareArray() function', () => {


        describe('With recursive arrays', () => {
            
            test('When both arrays contains an empty array', () => {
                
                const array1 = [[]]
                const array2 = [[]]

                const result = compareArrays(array1, array2)
                expect(result).toBeTruthy()

            })

            test('When both arrays contains an array with same values', () => {
                
                const array1 = [['ext1']]
                const array2 = [['ext1']]

                const result = compareArrays(array1, array2)
                expect(result).toBeTruthy()

            })

            test('When both arrays contains an array with different values', () => {
                
                const array1 = [['ext1']]
                const array2 = [['ext2']]

                const result = compareArrays(array1, array2)
                expect(result).toBeFalsy()

            })

            test('When both arrays contains an array with different length', () => {
                
                const array1 = [['ext1']]
                const array2 = [['ext1', 'ext2']]

                const result = compareArrays(array1, array2)
                expect(result).toBeFalsy()

            })

            describe('When the first array contain a nested array and the seccond do not', () => {
                
                test('The values are equals', () => {
                    const array1 = [['ext1']]
                    const array2 = ['ext1']
    
                    const result = compareArrays(array1, array2)
                    expect(result).toBeTruthy()
                })

                test('The values are different', () => {
                    const array1 = [['ext1']]
                    const array2 = ['ext2']
    
                    const result = compareArrays(array1, array2)
                    expect(result).toBeFalsy()
                })

            })

            describe('When the seccond array contain a nested array and the first do not', () => {
                
                test('The values are equals', () => {
                    const array1 = ['ext1']
                    const array2 = [['ext1']]
    
                    const result = compareArrays(array1, array2)
                    expect(result).toBeTruthy()
                })

                test('The values are different', () => {
                    const array1 = ['ext1']
                    const array2 = [['ext2']]
    
                    const result = compareArrays(array1, array2)
                    expect(result).toBeFalsy()
                })

            })

        })

    })

    

})