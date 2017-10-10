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
    FileMaxSizeValidator
} from '../src/validator'

function getSpecValue(spec) {
    if(spec) {
        if(spec.value != null && spec.value != undefined) {
            return spec.value
        } else if(spec.files && spec.files.length) {
            return JSON.stringify(spec.files)
        }
    }
}

function validate(validator, props, when, specs) {
    describe(when, () => {
        specs.forEach(spec => {
            test(`With value "${getSpecValue(spec)}"`, () => {
                let result = null
                if(validator.shouldValidate(spec.formCtrl || {}, props, spec.value, spec.files)) {
                    result = validator.validate(spec.formCtrl || {}, props, spec.value, spec.files)
                }
                expect(result).toEqual(spec.expect)
            })
        })
    })
}

describe('About the RequiredValidator', () => {

    const validator = new RequiredValidator()
    
    validate(validator, {required: true}, 'When has required prop', [
        {value: '', expect: false},
        {value: 'Test', expect: true},
    ])

    validate(validator, {type: 'file', required: true}, 'When has file type and required prop', [
        {files: [], expect: false},
        {files: [{name: 'file.pdf'}], expect: true}
    ])
    
    validate(validator, {}, 'When has not required prop', [
        {value: '', expect: null},
        {value: 'Test', expect: null},
    ])

    validate(validator, {type: 'file'}, 'When has file type but not required prop', [
        {files: [], expect: null},
        {files: [{name: 'file.pdf'}], expect: null}
    ])

})

describe('About the PatternValidator', () => {
    const validator = new PatternValidator()
    validate(validator, {pattern: '\\d+'}, 'When has a "\\d+" string pattern prop value', [
        {value: '', expect: null},
        {value: '9', expect: true},
        {value: '999', expect: true},
        {value: '999Te', expect: true},
        {value: 'Te999', expect: true},
        {value: 'Test', expect: {pattern: /\d+/}},
    ])

    validate(validator, {pattern: /\d+/}, 'When has a "/\\d+/" regexp pattern prop value', [
        {value: '', expect: null},
        {value: '9', expect: true},
        {value: '999', expect: true},
        {value: '999Te', expect: true},
        {value: 'Te999', expect: true},
        {value: 'Test', expect: {pattern: /\d+/}},
    ])

    validate(validator, {required: true}, 'When has not required prop', [
        {value: '', expect: null},
        {value: '9', expect: null},
        {value: '999', expect: null},
        {value: '999Te', expect: null},
        {value: 'Te999', expect: null},
        {value: 'Test', expect: null},
    ])
})

describe('About the IntegerValidator', () => {

    const validator = new IntegerValidator()
    validate(validator, {type: 'number', integer: true}, 'When has a number type and a integer prop', [
        {value: '', expect: null},
        {value: '9', expect: true},
        {value: '999', expect: true},
        {value: '9.', expect: false},
        {value: '9.5', expect: false},
        {value: '9.0', expect: false},
        {value: '999Te', expect: false},
        {value: 'Te999', expect: false},
        {value: 'Test', expect: false},
    ])

    validate(validator, {type: 'text', integer: true}, 'When has a integer prop but has not a number type', [
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

    validate(validator, {}, 'When has not a type and integer prop', [
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

})

describe('About the FloatValidator', () => {
    const validator = new FloatValidator()
    validate(validator, {type: 'number'}, 'When has a number type', [
        {value: '', expect: null},
        {value: '9', expect: true},
        {value: '999', expect: true},
        {value: '9.', expect: false},
        {value: '9.5', expect: true},
        {value: '9.0', expect: true},
        {value: '999Te', expect: false},
        {value: 'Te999', expect: false},
        {value: 'Test', expect: false},
    ])

    validate(validator, {}, 'When has not a number type', [
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

})

describe('About the MinLengthValidator', () => {

    const validator = new MinLengthValidator()
    validate(validator, {minLength: 5}, 'When has a 5 min length prop value', [
        {value: '', expect: null},
        {value: '9', expect: {length: 1, minLength: 5}},
        {value: '999', expect: {length: 3, minLength: 5}},
        {value: '9.', expect: {length: 2, minLength: 5}},
        {value: '9.5', expect: {length: 3, minLength: 5}},
        {value: '9.0', expect: {length: 3, minLength: 5}},
        {value: '999Te', expect: true},
        {value: 'Te999', expect: true},
        {value: 'Test', expect: {length: 4, minLength: 5}},
    ])

    validate(validator, {}, 'When has not a min length prop', [
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
})

describe('About the MaxLengthValidator', () => {
    
    const validator = new MaxLengthValidator()
    validate(validator, {maxLength: 4}, 'When has a 4 max length prop value', [
        {value: '', expect: null},
        {value: '9', expect: true},
        {value: '999', expect: true},
        {value: '9.', expect: true},
        {value: '9.5', expect: true},
        {value: '9.0', expect: true},
        {value: '999Te', expect: {length: 5, maxLength: 4}},
        {value: 'Te999', expect: {length: 5, maxLength: 4}},
        {value: 'Test', expect: true},
    ])

    validate(validator, {}, 'When has not a max length prop', [
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

})
describe('About the MinValidator', () => {

    const validator = new MinValidator()
    validate(validator, {type: 'number', min: 50}, 'When has a 50 min prop number value', [
        {value: null, expect: null},
        {value: 10, expect: {min: 50}},
        {value: 5, expect: {min: 50}},
        {value: 5.5, expect: {min: 50}},
        {value: 49.9, expect: {min: 50}},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: true},
        {value: 50.5, expect: true},
        {value: 150, expect: true},
        {value: 150.0, expect: true},
        {value: 150.5, expect: true},
    ])

    validate(validator, {type: 'number', min: 50.5}, 'When has a 50.5 min prop number value', [
        {value: null, expect: null},
        {value: 10, expect: {min: 50.5}},
        {value: 5, expect: {min: 50.5}},
        {value: 5.5, expect: {min: 50.5}},
        {value: 49.9, expect: {min: 50.5}},
        {value: 50, expect: {min: 50.5}},
        {value: 50.0, expect: {min: 50.5}},
        {value: 50.3, expect: {min: 50.5}},
        {value: 50.5, expect: true},
        {value: 150, expect: true},
        {value: 150.0, expect: true},
        {value: 150.5, expect: true},
    ])

    validate(validator, {type: 'number', min: '50'}, 'When has a 50 min prop string value', [
        {value: null, expect: null},
        {value: 10, expect: {min: 50}},
        {value: 5, expect: {min: 50}},
        {value: 5.5, expect: {min: 50}},
        {value: 49.9, expect: {min: 50}},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: true},
        {value: 50.5, expect: true},
        {value: 150, expect: true},
        {value: 150.0, expect: true},
        {value: 150.5, expect: true},
    ])

    validate(validator, {type: 'number', min: '50.5'}, 'When has a 50.5 min prop string value', [
        {value: null, expect: null},
        {value: 10, expect: {min: 50.5}},
        {value: 5, expect: {min: 50.5}},
        {value: 5.5, expect: {min: 50.5}},
        {value: 49.9, expect: {min: 50.5}},
        {value: 50, expect: {min: 50.5}},
        {value: 50.0, expect: {min: 50.5}},
        {value: 50.3, expect: {min: 50.5}},
        {value: 50.5, expect: true},
        {value: 150, expect: true},
        {value: 150.0, expect: true},
        {value: 150.5, expect: true},
    ])

})

describe('About the MaxValidator', () => {
    const validator = new MaxValidator()
    validate(validator, {type: 'number', max: 50}, 'When has a 50 max prop number value', [
        {value: null, expect: null},
        {value: 10, expect: true},
        {value: 5, expect: true},
        {value: 5.5, expect: true},
        {value: 49.9, expect: true},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: {max: 50}},
        {value: 50.5, expect: {max: 50}},
        {value: 150, expect: {max: 50}},
        {value: 150.0, expect: {max: 50}},
        {value: 150.5, expect: {max: 50}},
    ])

    validate(validator, {type: 'number', max: 50.3}, 'When has a 50.3 max prop number value', [
        {value: null, expect: null},
        {value: 10, expect: true},
        {value: 5, expect: true},
        {value: 5.5, expect: true},
        {value: 49.9, expect: true},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: true},
        {value: 50.5, expect: {max: 50.3}},
        {value: 150, expect: {max: 50.3}},
        {value: 150.0, expect: {max: 50.3}},
        {value: 150.5, expect: {max: 50.3}},
    ])
    validate(validator, {type: 'number', max: '50'}, 'When has a 50 max prop string value', [
        {value: null, expect: null},
        {value: 10, expect: true},
        {value: 5, expect: true},
        {value: 5.5, expect: true},
        {value: 49.9, expect: true},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: {max: 50}},
        {value: 50.5, expect: {max: 50}},
        {value: 150, expect: {max: 50}},
        {value: 150.0, expect: {max: 50}},
        {value: 150.5, expect: {max: 50}},
    ])

    validate(validator, {type: 'number', max: '50.3'}, 'When has a 50.3 max prop string value', [
        {value: null, expect: null},
        {value: 10, expect: true},
        {value: 5, expect: true},
        {value: 5.5, expect: true},
        {value: 49.9, expect: true},
        {value: 50, expect: true},
        {value: 50.0, expect: true},
        {value: 50.3, expect: true},
        {value: 50.5, expect: {max: 50.3}},
        {value: 150, expect: {max: 50.3}},
        {value: 150.0, expect: {max: 50.3}},
        {value: 150.5, expect: {max: 50.3}},
    ])
})

describe('About the FileAcceptValidator', () => {

    const validator = new FileAcceptValidator()
    validate(validator, {type: 'file', accept: 'image/png'}, 'When has file type and a accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: true},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: {files: [{name: 'test.jpg', type: 'image/jpg'}], accept: 'image/png'}},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: {files: [{name: 'test.jpeg', type: 'image/jpeg'}], accept: 'image/png'}},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/png'}},
    ])

    validate(validator, {type: 'file', accept: 'image/png,image/jpg'}, 'When has file type and multiple accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: true},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: true},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: {files: [{name: 'test.jpeg', type: 'image/jpeg'}], accept: 'image/png,image/jpg'}},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/png,image/jpg'}},
    ])

    validate(validator, {type: 'file', accept: 'image/*'}, 'When has file type and image wildcard accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: true},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: true},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: true},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: {files: [{name: 'test.pdf', type: 'application/pdf'}], accept: 'image/*'}},
    ])
    
    validate(validator, {type: 'file'}, 'When has file type but has not a accept prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])
    
    validate(validator, {accept: 'image/png'}, 'When has a accept prop but has not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])

    validate(validator, {}, 'When has not accept prop and file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png', type: 'image/png'}], expect: null},
        {files: [{name: 'test.jpg', type: 'image/jpg'}], expect: null},
        {files: [{name: 'test.jpeg', type: 'image/jpeg'}], expect: null},
        {files: [{name: 'test.pdf', type: 'application/pdf'}], expect: null},
    ])

})

describe('About the FileExtensionValidator', () => {

    const validator = new FileExtensionValidator()

    validate(validator, {type: 'file', extensions: ['png']}, 'When has file type and a extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: true},
        {files: [{name: 'test.jpg'}], expect: {files: [{name: 'test.jpg'}], extensions: ['png']}},
        {files: [{name: 'test.jpeg'}], expect: {files: [{name: 'test.jpeg'}], extensions: ['png']}},
        {files: [{name: 'test.pdf'}], expect: {files: [{name: 'test.pdf'}], extensions: ['png']}},
    ])

    validate(validator, {type: 'file', extensions: ['png', 'jpg']}, 'When has file type and multiple extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: true},
        {files: [{name: 'test.jpg'}], expect: true},
        {files: [{name: 'test.jpeg'}], expect: {files: [{name: 'test.jpeg'}], extensions: ['png', 'jpg']}},
        {files: [{name: 'test.pdf'}], expect: {files: [{name: 'test.pdf'}], extensions: ['png', 'jpg']}},
    ])

    validate(validator, {type: 'file', extensions: ['png', 'jpg', 'jpeg']}, 'When has file type and image wildcard extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: true},
        {files: [{name: 'test.jpg'}], expect: true},
        {files: [{name: 'test.jpeg'}], expect: true},
        {files: [{name: 'test.pdf'}], expect: {files: [{name: 'test.pdf'}], extensions: ['png', 'jpg', 'jpeg']}},
    ])
    
    validate(validator, {type: 'file'}, 'When has file type but has not a extensions prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])
    
    validate(validator, {extensions: ['png', 'jpg', 'jpeg']}, 'When has a extensions prop but has not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])

    validate(validator, {}, 'When has not extensions prop and file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png'}], expect: null},
        {files: [{name: 'test.jpg'}], expect: null},
        {files: [{name: 'test.jpeg'}], expect: null},
        {files: [{name: 'test.pdf'}], expect: null},
    ])

})

describe('About the FileMaxSizeValidator', () => {

    const validator = new FileMaxSizeValidator()

    validate(validator, {type: 'file', maxSize: 50000}, 'When has a file type and a maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: true},
        {files: [{name: 'test.jpg', size: 49999}], expect: true},
        {files: [{name: 'test.jpg', size: 50000}], expect: true},
        {files: [{name: 'test.jpeg', size: 50001}], expect: {files: [{name: 'test.jpeg', size: 50001}], maxSize: 50000}},
        {files: [{name: 'test.pdf', size: 500000}], expect: {files: [{name: 'test.pdf', size: 500000}], maxSize: 50000}},
    ])

    validate(validator, {type: 'file'}, 'When has a file type but not maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

    validate(validator, {maxSize: 50000}, 'When has a maxSize prop but not file type', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

    validate(validator, {}, 'When has not file type and a maxSize prop', [
        {files: [], expect: null},
        {files: [{name: 'test.png', size: 5000}], expect: null},
        {files: [{name: 'test.jpg', size: 49999}], expect: null},
        {files: [{name: 'test.jpg', size: 50000}], expect: null},
        {files: [{name: 'test.jpeg', size: 50001}], expect: null},
        {files: [{name: 'test.pdf', size: 500000}], expect: null},
    ])

})