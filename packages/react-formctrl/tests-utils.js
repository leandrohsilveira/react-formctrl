export const inputInject = (fieldCtrl) => ({
    name: fieldCtrl.name,
    type: fieldCtrl.type,
    className: fieldCtrl.className,
    value: fieldCtrl.value,
    onChange: fieldCtrl.onChange,
    onBlur: fieldCtrl.onBlur
})

export const formControlInject = (formCtrl) => ({
    name: formCtrl.formName, 
    formCtrl
})