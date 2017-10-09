import {
    RequiredValidator,
    PatternValidator,
    IntegerValidator,
    FloatValidator,
    MinLengthValidator,
    MaxLengthValidator,
    MinValidator,
    MaxValidator,
    FileAcceptValidator,
    FileExtensionValidator,
    FileMaxSizeValidator,

    combineValidators,
    validate
} from '../src/validator/validator'

function getSpecValue(spec) {
    if(spec) {
        if(spec.value != null && spec.value != undefined) {
            return spec.value
        } else if(spec.files && spec.files.length) {
            return JSON.stringify(spec.files)
        }
    }
}

function describeValidate(validators, props, when, specs) {
    describe(when, () => {
        specs.forEach(spec => {
            test(`With value "${getSpecValue(spec)}"`, () => {
                let result = validate(validators, spec.formCtrl || {}, props, spec.value, spec.files)
                expect(result).toEqual(spec.expect)
            })
        })
    })
}

describe('About all validators together', () => {

    const validators = combineValidators([])
    
    describeValidate(validators, {}, 'When has not any prop', [
        {value: '', expect: null},
        {value: '9', expect: null},
        {value: '999', expect: null},
        {value: '9.', expect: null},
        {value: '9.5', expect: null},
        {value: '9.0', expect: null},
        {value: '999Te', expect: null},
        {value: 'Te999', expect: null},
        {value: 'Test', expect: null},
        {value: null, expect: null},
        {value: 10, expect: null},
        {value: 5, expect: null},
        {value: 5.5, expect: null},
        {value: 49.9, expect: null},
        {value: 50, expect: null},
        {value: 50.0, expect: null},
        {value: 50.3, expect: null},
        {value: 50.5, expect: null},
        {value: 150, expect: null},
        {value: 150.0, expect: null},
        {value: 150.5, expect: null},
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])

    describeValidate(validators, {required: true}, 'When has required prop', [
        {value: '', expect: [{key: 'required'}]},
        {value: 'Test', expect: []},
    ])

    describeValidate(validators, {type: 'file', required: true}, 'When has file type and required prop', [
        {files: [], expect: [{key: 'required'}]},
        {files: [{name: 'file.pdf'}], expect: []}
    ])
    

    describeValidate(validators, {type: 'file'}, 'When has file type but not required prop', [
        {files: [], expect: null},
        {files: [{name: 'file.pdf'}], expect: null}
    ])

    describeValidate(validators, {pattern: '\\d+'}, 'When has a "\\d+" string pattern prop value', [
        {value: '', expect: null},
        {value: '9', expect: []},
        {value: '999', expect: []},
        {value: '999Te', expect: []},
        {value: 'Te999', expect: []},
        {value: 'Test', expect: [{key: 'pattern', params: {value: 'Test', pattern: /\d+/}}]},
    ])

    describeValidate(validators, {pattern: /\d+/}, 'When has a "/\\d+/" regexp pattern prop value', [
        {value: '', expect: null},
        {value: '9', expect: []},
        {value: '999', expect: []},
        {value: '999Te', expect: []},
        {value: 'Te999', expect: []},
        {value: 'Test', expect: [{key: 'pattern', params: {value: 'Test', pattern: /\d+/}}]},
    ])

    describeValidate(validators, {type: 'number', integer: true}, 'When has a number type and a integer prop', [
        {value: '', expect: null},
        {value: '9', expect: []},
        {value: '999', expect: []},
        {value: '9.', expect: [{key: 'integer', params: {value: '9.'}}]},
        {value: '9.5', expect: [{key: 'integer', params: {value: '9.5'}}]},
        {value: '9.0', expect: [{key: 'integer', params: {value: '9.0'}}]},
        {value: '999Te', expect: [{key: 'integer', params: {value: '999Te'}}]},
        {value: 'Te999', expect: [{key: 'integer', params: {value: 'Te999'}}]},
        {value: 'Test', expect: [{key: 'integer', params: {value: 'Test'}}]},
    ])

    describeValidate(validators, {type: 'text', integer: true}, 'When has a integer prop but has not a number type', [
        {value: '', expect: null},
        {value: '9', expect: null},
        {value: '999', expect: null},
        {value: '9.', expect: null},
        {value: '9.5', expect: null},
        {value: '9.0', expect: null},
        {value: '999Te', expect: null},
        {value: 'Te999', expect: null},
        {value: 'Test', expect: null},
    ])



    describeValidate(validators, {type: 'number'}, 'When has a number type', [
        {value: '', expect: null},
        {value: '9', expect: []},
        {value: '999', expect: []},
        {value: '9.', expect: [{key: 'float', params: {value: '9.'}}]},
        {value: '9.5', expect: []},
        {value: '9.0', expect: []},
        {value: '999Te', expect: [{key: 'float', params: {value: '999Te'}}]},
        {value: 'Te999', expect: [{key: 'float', params: {value: 'Te999'}}]},
        {value: 'Test', expect: [{key: 'float', params: {value: 'Test'}}]},
    ])

    describeValidate(validators, {minLength: 5}, 'When has a 5 min length prop value', [
        {value: '', expect: null},
        {value: '9', expect: [{key: 'minLength', params: {value: '9', length: 1, minLength: 5}}]},
        {value: '999', expect: [{key: 'minLength', params: {value: '999', length: 3, minLength: 5}}]},
        {value: '9.', expect: [{key: 'minLength', params: {value: '9.', length: 2, minLength: 5}}]},
        {value: '9.5', expect: [{key: 'minLength', params: {value: '9.5', length: 3, minLength: 5}}]},
        {value: '9.0', expect: [{key: 'minLength', params: {value: '9.0', length: 3, minLength: 5}}]},
        {value: '999Te', expect: []},
        {value: 'Te999', expect: []},
        {value: 'Test', expect: [{key: 'minLength', params: {value: 'Test', length: 4, minLength: 5}}]},
    ])

    describeValidate(validators, {maxLength: 4}, 'When has a 4 max length prop value', [
        {value: '', expect: null},
        {value: '9', expect: []},
        {value: '999', expect: []},
        {value: '9.', expect: []},
        {value: '9.5', expect: []},
        {value: '9.0', expect: []},
        {value: '999Te', expect: [{key: 'maxLength', params: {value: '999Te', length: 5, maxLength: 4}}]},
        {value: 'Te999', expect: [{key: 'maxLength', params: {value: 'Te999', length: 5, maxLength: 4}}]},
        {value: 'Test', expect: []},
    ])

    describeValidate(validators, {type: 'number', min: 50}, 'When has a 50 min prop number value', [
        {value: null, expect: null},
        {value: 10, expect: [{key: 'min', params: {value: 10, min: 50}}]},
        {value: 5, expect: [{key: 'min', params: {value: 5, min: 50}}]},
        {value: 5.5, expect: [{key: 'min', params: {value: 5.5, min: 50}}]},
        {value: 49.9, expect: [{key: 'min', params: {value: 49.9, min: 50}}]},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: []},
        {value: 50.5, expect: []},
        {value: 150, expect: []},
        {value: 150.0, expect: []},
        {value: 150.5, expect: []},
    ])

    describeValidate(validators, {type: 'number', min: 50.5}, 'When has a 50.5 min prop number value', [
        {value: null, expect: null},
        {value: 10, expect: [{key: 'min', params: {value: 10, min: 50.5}}]},
        {value: 5, expect: [{key: 'min', params: {value: 5, min: 50.5}}]},
        {value: 5.5, expect: [{key: 'min', params: {value: 5.5, min: 50.5}}]},
        {value: 49.9, expect: [{key: 'min', params: {value: 49.9, min: 50.5}}]},
        {value: 50, expect: [{key: 'min', params: {value: 50, min: 50.5}}]},
        {value: 50.0, expect: [{key: 'min', params: {value: 50.0, min: 50.5}}]},
        {value: 50.3, expect: [{key: 'min', params: {value: 50.3, min: 50.5}}]},
        {value: 50.5, expect: []},
        {value: 150, expect: []},
        {value: 150.0, expect: []},
        {value: 150.5, expect: []},
    ])

    describeValidate(validators, {type: 'number', min: '50'}, 'When has a 50 min prop string value', [
        {value: null, expect: null},
        {value: 10, expect: [{key: 'min', params: {value: 10, min: 50}}]},
        {value: 5, expect: [{key: 'min', params: {value: 5, min: 50}}]},
        {value: 5.5, expect: [{key: 'min', params: {value: 5.5, min: 50}}]},
        {value: 49.9, expect: [{key: 'min', params: {value: 49.9, min: 50}}]},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: []},
        {value: 50.5, expect: []},
        {value: 150, expect: []},
        {value: 150.0, expect: []},
        {value: 150.5, expect: []},
    ])

    describeValidate(validators, {type: 'number', min: '50.5'}, 'When has a 50.5 min prop string value', [
        {value: null, expect: null},
        {value: 10, expect: [{key: 'min', params: {value: 10, min: 50.5}}]},
        {value: 5, expect: [{key: 'min', params: {value: 5, min: 50.5}}]},
        {value: 5.5, expect: [{key: 'min', params: {value: 5.5, min: 50.5}}]},
        {value: 49.9, expect: [{key: 'min', params: {value: 49.9, min: 50.5}}]},
        {value: 50, expect: [{key: 'min', params: {value: 50, min: 50.5}}]},
        {value: 50.0, expect: [{key: 'min', params: {value: 50.0, min: 50.5}}]},
        {value: 50.3, expect: [{key: 'min', params: {value: 50.3, min: 50.5}}]},
        {value: 50.5, expect: []},
        {value: 150, expect: []},
        {value: 150.0, expect: []},
        {value: 150.5, expect: []},
    ])

    describeValidate(validators, {type: 'number', max: 50}, 'When has a 50 max prop number value', [
        {value: null, expect: null},
        {value: 10, expect: []},
        {value: 5, expect: []},
        {value: 5.5, expect: []},
        {value: 49.9, expect: []},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: [{key: 'max', params: {value: 50.3, max: 50}}]},
        {value: 50.5, expect: [{key: 'max', params: {value: 50.5, max: 50}}]},
        {value: 150, expect: [{key: 'max', params: {value: 150, max: 50}}]},
        {value: 150.0, expect: [{key: 'max', params: {value: 150.0, max: 50}}]},
        {value: 150.5, expect: [{key: 'max', params: {value: 150.5, max: 50}}]},
    ])

    describeValidate(validators, {type: 'number', max: 50.3}, 'When has a 50.3 max prop number value', [
        {value: null, expect: null},
        {value: 10, expect: []},
        {value: 5, expect: []},
        {value: 5.5, expect: []},
        {value: 49.9, expect: []},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: []},
        {value: 50.5, expect: [{key: 'max', params: {value: 50.5, max: 50.3}}]},
        {value: 150, expect: [{key: 'max', params: {value: 150, max: 50.3}}]},
        {value: 150.0, expect: [{key: 'max', params: {value: 150.0, max: 50.3}}]},
        {value: 150.5, expect: [{key: 'max', params: {value: 150.5, max: 50.3}}]},
    ])
    describeValidate(validators, {type: 'number', max: '50'}, 'When has a 50 max prop string value', [
        {value: null, expect: null},
        {value: 10, expect: []},
        {value: 5, expect: []},
        {value: 5.5, expect: []},
        {value: 49.9, expect: []},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: [{key: 'max', params: {value: 50.3, max: 50}}]},
        {value: 50.5, expect: [{key: 'max', params: {value: 50.5, max: 50}}]},
        {value: 150, expect: [{key: 'max', params: {value: 150, max: 50}}]},
        {value: 150.0, expect: [{key: 'max', params: {value: 150.0, max: 50}}]},
        {value: 150.5, expect: [{key: 'max', params: {value: 150.5, max: 50}}]},
    ])

    describeValidate(validators, {type: 'number', max: '50.3'}, 'When has a 50.3 max prop string value', [
        {value: null, expect: null},
        {value: 10, expect: []},
        {value: 5, expect: []},
        {value: 5.5, expect: []},
        {value: 49.9, expect: []},
        {value: 50, expect: []},
        {value: 50.0, expect: []},
        {value: 50.3, expect: []},
        {value: 50.5, expect: [{key: 'max', params: {value: 50.5, max: 50.3}}]},
        {value: 150, expect: [{key: 'max', params: {value: 150, max: 50.3}}]},
        {value: 150.0, expect: [{key: 'max', params: {value: 150.0, max: 50.3}}]},
        {value: 150.5, expect: [{key: 'max', params: {value: 150.5, max: 50.3}}]},
    ])

    describeValidate(validators, {type: 'file', accept: 'image/png'}, 'When has file type and a accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: []},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: [{key: 'accept', params: {files: [{name: 'test.jpg', type: 'image/jpg'}], accept: 'image/png'}}]},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: [{key: 'accept', params: {files: [{name: 'test.jpeg', type: 'image/jpeg'}], accept: 'image/png'}}]},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: [{key: 'accept', params: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/png'}}]},
    ])

    describeValidate(validators, {type: 'file', accept: 'image/png,image/jpg'}, 'When has file type and multiple accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: []},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: []},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: [{key: 'accept', params: {files: [{name: 'test.jpeg', type: 'image/jpeg'}], accept: 'image/png,image/jpg'}}]},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: [{key: 'accept', params: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/png,image/jpg'}}]},
    ])

    describeValidate(validators, {type: 'file', accept: 'image/*'}, 'When has file type and image wildcard accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: []},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: []},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: []},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: [{key: 'accept', params: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/*'}}]},
    ])
    
    describeValidate(validators, {type: 'file'}, 'When has file type but has not a accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])
    
    describeValidate(validators, {accept: 'image/png'}, 'When has a accept prop but has not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])

    describeValidate(validators, {type: 'file', extensions: ['png']}, 'When has file type and a extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: []},
        {files: [{name: 'test.jpg'}], expect: [{key: 'extensions', params: {files: [{name: 'test.jpg'}], extensions: ['png']}}]},
        {files: [{name: 'test.jpeg'}], expect: [{key: 'extensions', params: {files: [{name: 'test.jpeg'}], extensions: ['png']}}]},
        {files: [{name: 'test.pdf'}], expect: [{key: 'extensions', params: {files: [{name: 'test.pdf'}], extensions: ['png']}}]},
    ])

    describeValidate(validators, {type: 'file', extensions: ['png', 'jpg']}, 'When has file type and multiple extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: []},
        {files: [{name: 'test.jpg'}], expect: []},
        {files: [{name: 'test.jpeg'}], expect: [{key: 'extensions', params: {files: [{name: 'test.jpeg'}], extensions: ['png', 'jpg']}}]},
        {files: [{name: 'test.pdf'}], expect: [{key: 'extensions', params: {files: [{name: 'test.pdf'}], extensions: ['png', 'jpg']}}]},
    ])

    describeValidate(validators, {type: 'file', extensions: ['png', 'jpg', 'jpeg']}, 'When has file type and image wildcard extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: []},
        {files: [{name: 'test.jpg'}], expect: []},
        {files: [{name: 'test.jpeg'}], expect: []},
        {files: [{name: 'test.pdf'}], expect: [{key: 'extensions', params: {files: [{name: 'test.pdf'}], extensions: ['png', 'jpg', 'jpeg']}}]},
    ])
    
    describeValidate(validators, {type: 'file'}, 'When has file type but has not a extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])
    
    describeValidate(validators, {extensions: ['png', 'jpg', 'jpeg']}, 'When has a extensions prop but has not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])

    describeValidate(validators, {}, 'When has not extensions prop and file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])

    describeValidate(validators, {type: 'file', maxSize: 50000}, 'When has a file type and a maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: []},
        {files: [{name: 'test.jpg', size: 49999}], expect: []},
        {files: [{name: 'test.jpg', size: 50000}], expect: []},
        {files: [{name: 'test.jpeg', size: 50001}], expect: [{key: 'maxSize', params: {files: [{name: 'test.jpeg', size: 50001}], maxSize: 50000}}]},
        {files: [{name: 'test.pdf', size: 500000}], expect: [{key: 'maxSize', params: {files: [{name: 'test.pdf', size: 500000}], maxSize: 50000}}]},
    ])

    describeValidate(validators, {type: 'file'}, 'When has a file type but not maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

    describeValidate(validators, {maxSize: 50000}, 'When has a maxSize prop but not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

    describeValidate(validators, {}, 'When has not file type and a maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

})