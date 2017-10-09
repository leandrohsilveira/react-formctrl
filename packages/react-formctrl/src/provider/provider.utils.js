export function copyFiles(selectedFiles) {
    if(selectedFiles) {
        if(Array.isArray(selectedFiles)) {
            return copyArray(selectedFiles)
        } else {
            const files = []
            for(var i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles.item(i)
                files.push(file)
            }
            return files
        }
    }
    return []
}

export function copyArray(array) {
    if(array) {
        return array.map(item => item)
    }
    return []
}

export function copyFieldCtrlProps(props) {
    return {
        name: props.name,
        form: props.form,
        type: props.type,
        required: props.required,
        pattern: props.pattern,
        match: props.match,
        integer: props.integer,
        min: props.min,
        max: props.max,
        minLength: props.minLength,
        maxLength: props.maxLength,
        accept: props.accept,
        extensions: copyArray(props.extensions),
        maxSize: props.maxSize,
        validate: props.validate
    }
}

export function copyError(error) {
    const output = {
        key: error.key
    }
    if(error.params) {
        const params = {}
        Object.keys(error.params).forEach(paramName => {
            const param = error.params[paramName]
            if(Array.isArray(param)) params[paramName] = copyArray(param)
            else if(param instanceof FileList) params[paramName] = copyFiles(param)
            else params[paramName] = param
        })
        output.params = params
    }
    return output
}

export function copyErrors(errors) {
    if(errors && errors.length) {
        return errors.map(error => copyError(error))
    }
    return errors
}

export function copyFieldCtrl(fieldCtrl) {
    return {
        valid: fieldCtrl.valid,
        invalid: fieldCtrl.invalid,
        untouched: fieldCtrl.untouched,
        touched: fieldCtrl.touched,
        pristine: fieldCtrl.pristine,
        dirty: fieldCtrl.dirty,
        unchanged: fieldCtrl.unchanged,
        changed: fieldCtrl.changed,
        errors: copyErrors(fieldCtrl.errors),
        value: fieldCtrl.value,
        files: fieldCtrl.files,
        initialValue: fieldCtrl.initialValue,
        props: copyFieldCtrlProps(fieldCtrl.props)
    }
}

export function copyFormValues(values) {
    const cValues = {}
    if(values) {
        const fieldsNames = Object.keys(values)
        if(fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cValues[fieldName] = values[fieldName]
            })
        }
    }
    return cValues
}

export function copyFormFiles(files) {
    const cFiles = {}
    if(files) {
        const fieldsNames = Object.keys(files)
        if(fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cFiles[fieldName] = copyFiles(files[fieldName])
            })
        }
    }
    return cFiles
}

export function copyFormFields(fields) {
    const cFields = {}
    if(fields) {
        const fieldsNames = Object.keys(fields)
        if(fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cFields[fieldName] = copyFieldCtrl(fields[fieldName])
            })
        }
    }
    return cFields
}

export function copyFormCtrl(formCtrl) {
    return {
        valid: formCtrl.valid,
        invalid: formCtrl.invalid,
        untouched: formCtrl.untouched,
        touched: formCtrl.touched,
        pristine: formCtrl.pristine,
        dirty: formCtrl.dirty,
        unchanged: formCtrl.unchanged,
        changed: formCtrl.changed,
        fields: copyFormFields(formCtrl.fields),
        values: copyFormValues(formCtrl.values),
        files: copyFormFiles(formCtrl.files),
    }
}