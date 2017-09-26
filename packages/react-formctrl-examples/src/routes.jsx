import React from 'react'
import {Route} from 'react-router-dom'

import {Case} from './case'

import {BasicForm} from './cases/basic-form'
import {MoreOfBasicForm} from './cases/moreofbasic-form'
import {FieldValidationForm} from './cases/field-validation'
import {FormControlExample} from './cases/form-control-example'
import {SynchronizedForms} from './cases/synchronized-forms'
import {FormValuesManipulationExample} from './cases/form-values-manipulation'
import {UserFormApp} from './cases/user-form'
import {CustomValidatorExample} from './cases/custom-validators'
import {FieldsExample} from './cases/fields'

export function Routes({branch = 'master'}) {
    const rootPath = 'react-formctrl-examples/src/cases'
    const baseRawGithub = `https://raw.githubusercontent.com/leandrohsilveira/react-formctrl/${branch}/packages/${rootPath}`
    return (
        <Route path="/" render={() => (
            <div>
                <Route exact path="/" render={() => (
                    <Case fileName={`${rootPath}/basic-form.jsx`} url={`${baseRawGithub}/basic-form.jsx`}>
                        <BasicForm />
                    </Case>
                )} />

                <Route path="/more" render={() => (
                    <Case fileName={`${rootPath}/moreofbasic-form.jsx`} url={`${baseRawGithub}/moreofbasic-form.jsx`}>
                        <MoreOfBasicForm />
                    </Case>
                )} />

                <Route path="/validation" render={() => (
                    <Case fileName={`${rootPath}/field-validation.jsx`} url={`${baseRawGithub}/field-validation.jsx`}>
                        <FieldValidationForm />
                    </Case>
                )} />

                <Route path="/form-control" render={() => (
                    <Case fileName={`${rootPath}/form-control-example.jsx`} url={`${baseRawGithub}/form-control-example.jsx`}>
                        <FormControlExample />
                    </Case>
                )} />
                
                <Route path="/sync-forms" render={() => (
                    <Case fileName={`${rootPath}/synchronized-forms.jsx`} url={`${baseRawGithub}/synchronized-forms.jsx`}>
                        <SynchronizedForms />
                    </Case>
                )} />

                <Route path="/form-values-manipulation" render={() => (
                    <Case fileName={`${rootPath}/form-values-manipulation.jsx`} url={`${baseRawGithub}/form-values-manipulation.jsx`}>
                        <FormValuesManipulationExample />
                    </Case>
                )} />

                <Route path="/users" render={(props) => (
                    <Case fileName={`${rootPath}/user-form.jsx`} url={`${baseRawGithub}/user-form.jsx`}>
                        <UserFormApp {...props} />
                    </Case>
                )} />

                <Route path="/custom-validators" render={(props) => (
                    <Case fileName={`${rootPath}/custom-validators.jsx`} url={`${baseRawGithub}/custom-validators.jsx`}>
                        <CustomValidatorExample {...props} />
                    </Case>
                )} />
                <Route path="/fields" render={(props) => (
                    <FieldsExample />
                )} />
            </div>

        )} />
    )
}