import React from 'react'
import {Route} from 'react-router-dom'

import {Case} from './components/case'

import {BasicForm} from './cases/basic-form'
import {MoreOfBasicForm} from './cases/moreofbasic-form'
import {FieldValidationForm} from './cases/field-validation'
import {FormControlExample} from './cases/form-control-example'
import {SynchronizedForms} from './cases/synchronized-forms'
import {FormValuesManipulationExample} from './cases/form-values-manipulation'
import {UserFormApp} from './cases/user-form'
import {CustomValidatorExample} from './cases/custom-validators'
import {FieldsExample} from './cases/fields'
import {ReadMe} from './components/read-me'

export function Routes({branch = 'master'}) {
    const rootUrl = `https://raw.githubusercontent.com/leandrohsilveira/react-formctrl/${branch}`

    const examplePath = 'react-formctrl-examples/src/cases'
    const rawExampleUrl = `${rootUrl}/packages/${examplePath}`
    return (
        <Route path="/" render={() => (
            <div>
                <Route exact path="/" render={() => (
                    <ReadMe path={`${rootUrl}/README.md`} />
                )} />

                <Route exact path="/basic" render={() => (
                    <Case fileName={`${examplePath}/basic-form.jsx`} url={`${rawExampleUrl}/basic-form.jsx`}>
                        <BasicForm />
                    </Case>
                )} />

                <Route path="/more" render={() => (
                    <Case fileName={`${examplePath}/moreofbasic-form.jsx`} url={`${rawExampleUrl}/moreofbasic-form.jsx`}>
                        <MoreOfBasicForm />
                    </Case>
                )} />

                <Route path="/validation" render={() => (
                    <Case fileName={`${examplePath}/field-validation.jsx`} url={`${rawExampleUrl}/field-validation.jsx`}>
                        <FieldValidationForm />
                    </Case>
                )} />

                <Route path="/form-control" render={() => (
                    <Case fileName={`${examplePath}/form-control-example.jsx`} url={`${rawExampleUrl}/form-control-example.jsx`}>
                        <FormControlExample />
                    </Case>
                )} />
                
                <Route path="/sync-forms" render={() => (
                    <Case fileName={`${examplePath}/synchronized-forms.jsx`} url={`${rawExampleUrl}/synchronized-forms.jsx`}>
                        <SynchronizedForms />
                    </Case>
                )} />

                <Route path="/form-values-manipulation" render={() => (
                    <Case fileName={`${examplePath}/form-values-manipulation.jsx`} url={`${rawExampleUrl}/form-values-manipulation.jsx`}>
                        <FormValuesManipulationExample />
                    </Case>
                )} />

                <Route path="/users" render={(props) => (
                    <Case fileName={`${examplePath}/user-form.jsx`} url={`${rawExampleUrl}/user-form.jsx`}>
                        <UserFormApp {...props} />
                    </Case>
                )} />

                <Route path="/custom-validators" render={(props) => (
                    <Case fileName={`${examplePath}/custom-validators.jsx`} url={`${rawExampleUrl}/custom-validators.jsx`}>
                        <CustomValidatorExample {...props} />
                    </Case>
                )} />
                <Route path="/fields" render={(props) => (
                    <Case fileName={`${examplePath}/fields.jsx`} url={`${rawExampleUrl}/fields.jsx`}>
                        <FieldsExample {...props} />
                    </Case>
                )} />
            </div>

        )} />
    )
}