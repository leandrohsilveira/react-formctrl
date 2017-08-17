import React from 'react'
import ReactDOM from 'react-dom'

import javascript from 'react-syntax-highlighter/dist/languages/javascript';
import json from 'react-syntax-highlighter/dist/languages/json';
import { registerLanguage } from "react-syntax-highlighter/dist/light"

import {FormProvider} from '../'
import {SubmitValuesPopup} from './submit-values'
import {Case} from './case'

import {BasicForm} from './cases/basic-form'
import {MoreOfBasicForm} from './cases/moreofbasic-form'
import {FieldValidationForm} from './cases/field-validation'
import {FormControlExample} from './cases/form-control-example'
import {SynchronizedForms} from './cases/synchronized-forms'

import './app.scss'

export function App(props) {
    registerLanguage('javascript', javascript);
    registerLanguage('json', json);

    const rootPath = 'example/cases'
    const baseRawGithub = `https://raw.githubusercontent.com/leandrohsilveira/react-formctrl/master/${rootPath}`
    return (
        <FormProvider>
            <div>
                <SubmitValuesPopup />
                <div className="header">
                    <h1>ReactJS controlled forms</h1>
                    <p>react-formctrl is a lightweight forms controller library for ReactJS inspired by Angular forms and Redux forms.</p>
                </div>
                <Case fileName={`${rootPath}/basic-form.jsx`} url={`${baseRawGithub}/basic-form.jsx`}>
                    <BasicForm />
                </Case>
                <Case fileName={`${rootPath}/moreofbasic-form.jsx`} url={`${baseRawGithub}/moreofbasic-form.jsx`}>
                    <MoreOfBasicForm />
                </Case>
                <Case fileName={`${rootPath}/field-validation.jsx`} url={`${baseRawGithub}/field-validation.jsx`}>
                    <FieldValidationForm />
                </Case>
                <Case fileName={`${rootPath}/form-control-example.jsx`} url={`${baseRawGithub}/form-control-example.jsx`}>
                    <FormControlExample />
                </Case>
                <Case fileName={`${rootPath}/synchronized-forms.jsx`} url={`${baseRawGithub}/synchronized-forms.jsx`}>
                    <SynchronizedForms />
                </Case>
            </div>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))