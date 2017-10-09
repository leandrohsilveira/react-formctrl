const INTEGER_REGEX = /^-?\d+?$/
const FLOAT_REGEX = /^-?\d+(\.\d+)?$/
const EMAIL_REGEX = /\S+@\S+\.\S+/

function shouldValidateFile(props, files) {
    return props.type === 'file' && files && files.length
}

export class Validator {

    constructor(name) {
        this.name = name
    }

    shouldValidate(props, value, files) {
        return true;
    }

    validate(props, value, files) {
        return true
    }

    createValidationError(params) {
        return {
            key: this.name,
            params: params
        }
    }

}

export class RequiredValidator extends Validator {

    constructor() {
        super('required')
    }

    shouldValidate(props, value, files) {
        return !!props.required
    }

    validate(props, value, files) {
        if(props.type === 'file') {
            return !!files && !!files.length
        } else {
            return !!value
        }
    }

}

export class PatternValidator extends Validator {

    constructor() {
        super('pattern')
    }

    shouldValidate(props, value, files) {
        return !!props.pattern && (shouldValidateFile(props, files) || !!value)
    }

    getRegExp(props) {
        if(props.pattern instanceof RegExp) {
            return props.pattern
        } else {
            return new RegExp(props.pattern)
        }
    }

    validate(props, value, files) {
        const pattern = this.getRegExp(props)
        return !pattern.test(value) ? {pattern} : true
    }

}

export class EmailValidator extends Validator {

    constructor() {
        super('email')
    }

    shouldValidate(props, value, files) {
        return !!value && props.type === 'email'
    }

    validate(props, value, files) {
        return EMAIL_REGEX.test(value)
    }

}

export class IntegerValidator extends Validator {

    constructor() {
        super('integer')
    }

    shouldValidate(props, value, files) {
        return !!value && props.type === 'number' && props.integer
    }

    validate(props, value, files) {
        return INTEGER_REGEX.test(value)
    }

}

export class FloatValidator extends Validator {

    constructor() {
        super('float')
    }

    shouldValidate(props, value, files) {
        return !!value && props.type === 'number' && !props.integer
    }

    validate(props, value, files) {
        return FLOAT_REGEX.test(value)
    }

}

export class MinLengthValidator extends Validator {

    constructor() {
        super('minLength')
    }

    shouldValidate(props, value, files) {
        return !!value && props.minLength !== undefined && props.minLength !== null
    }

    validate(props, value, files) {
        return (value+'').length < +props.minLength ? {length: (value+'').length, minLength: +props.minLength} : true
    }

}

export class MaxLengthValidator extends Validator {

    constructor() {
        super('maxLength')
    }

    shouldValidate(props, value, files) {
        return !!value && props.maxLength !== undefined && props.maxLength !== null
    }

    validate(props, value, files) {
        return (value+'').length > +props.maxLength ? {length: (value+'').length, maxLength: props.maxLength} : true
    }

}

export class MinValidator extends Validator {

    constructor() {
        super('min')
    }

    shouldValidate(props, value, files) {
        return !!value && props.type === 'number' && props.min !== undefined && props.min !== null
    }

    validate(props, value, files) {
        return +value < +props.min ? {min: +props.min} : true
    }

}

export class MaxValidator extends Validator {

    constructor() {
        super('max')
    }

    shouldValidate(props, value, files) {
        return !!value && props.type === 'number' && props.max !== undefined && props.max !== null
    }
    
    validate(props, value, files) {
        return +value > +props.max ? {max: +props.max} : true
    }

}

export class FileAcceptValidator extends Validator {

    constructor() {
        super('accept')
    }

    shouldValidate(props, value, files) {
        return props.type === 'file' && !!props.accept && files && files.length
    }

    validate(props, value, files) {
        const unmatchedFiles = files.filter(file => {
            const matchedAccepts = props.accept.replace(/ /g, '').split(',').filter(mimetype => new RegExp(`^${mimetype.replace(/\*/g, '.*')}$`).test(file.type))
            return matchedAccepts.length === 0
        })
        return unmatchedFiles.length > 0 ? {files: unmatchedFiles, accept: props.accept} : true
    }
    
}

export class FileExtensionValidator extends Validator {

    constructor() {
        super('extensions')
    }

    shouldValidate(props, value, files) {
        return props.type === 'file' && props.extensions && props.extensions.length && files && files.length
    }

    validate(props, value, files) {
        const unmatchedFiles = files.filter(file => {
            const matchedAccepts = props.extensions.filter(extension => {
                const regex = new RegExp(`\\.${extension.replace(/\./, '')}$`, 'i')
                return regex.test(file.name)
            })
            return matchedAccepts.length === 0
        })
        return unmatchedFiles.length > 0 ? {files: unmatchedFiles, extensions: props.extensions} : true
    }
    
}

export class FileMaxSizeValidator extends Validator {

    constructor() {
        super('maxSize')
    }

    shouldValidate(props, value, files) {
        return props.type === 'file' && +props.maxSize > 0 && files && files.length
    }

    validate(props, value, files) {
        const unmatchedFiles = files.filter(file => {
            return file.size > +props.maxSize
        })
        return unmatchedFiles.length > 0 ? {files: unmatchedFiles, maxSize: +props.maxSize} : true
    }

}

export function getDefaultValidators() {

    const validators = []
    validators.push(new RequiredValidator())
    validators.push(new PatternValidator())
    validators.push(new EmailValidator())
    validators.push(new IntegerValidator())
    validators.push(new FloatValidator())
    validators.push(new MinLengthValidator())
    validators.push(new MaxLengthValidator())
    validators.push(new MinValidator())
    validators.push(new MaxValidator())
    validators.push(new FileAcceptValidator())
    validators.push(new FileExtensionValidator())
    validators.push(new FileMaxSizeValidator())
    return validators;

}

export function combineValidators(customValidators = []) {

    const validators = getDefaultValidators()

    let _customValidators = customValidators
    if(!Array.isArray(_customValidators)) {
        _customValidators = [_customValidators]
    }

    _customValidators.forEach(validator => validators.push(validator))

    return validators

}

export function validate(validators = [], props, value, files) {
    const matchedValidators = validators.filter(validator =>  validator.shouldValidate(props, value, files))
    if(matchedValidators && matchedValidators.length) {
        const errors = []
        matchedValidators.forEach(validator => {
            const result = validator.validate(props, value, files)
            if(typeof result === 'boolean' && !result) {
                errors.push(validator.createValidationError({}))
            } else {
                errors.push(validator.createValidationError(result))
            }
        })
        return errors
    }
    return null
}