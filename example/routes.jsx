import React from 'react'
import {Route} from 'react-router-dom'

import {Case} from './case'

import {BasicForm} from './cases/basic-form'
import {MoreOfBasicForm} from './cases/moreofbasic-form'
import {FieldValidationForm} from './cases/field-validation'
import {FormControlExample} from './cases/form-control-example'
import {SynchronizedForms} from './cases/synchronized-forms'

export function Routes({branch = 'master'}) {
    const rootPath = 'example/cases'
    const baseRawGithub = `https://raw.githubusercontent.com/leandrohsilveira/react-formctrl/${branch}/${rootPath}`
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
            </div>

        )} />
    )
}