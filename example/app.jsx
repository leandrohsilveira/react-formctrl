import React from 'react'
import ReactDOM from 'react-dom'

import {FormProvider} from '../'
import {SubmitValuesPopup} from './submit-values'

import {BasicForm} from './cases/basic-form'
import {MoreOfBasicForm} from './cases/moreofbasic-form'
import {FieldValidationForm} from './cases/field-validation'
import {FormControlExample} from './cases/form-control-example'
import {SynchronizedForms} from './cases/synchronized-forms'

import 'modules/highlight.js/styles/vs2015.css'

export function App(props) {
    return (
        <FormProvider>
            <div>
                <SubmitValuesPopup />
                <h1>ReactJS controlled forms</h1>
                <p>react-formctrl is a lightweight forms controller library for ReactJS inspired by Angular forms and Redux forms.</p>
                <hr/>
                <BasicForm />
                <MoreOfBasicForm />
                <FieldValidationForm />
                <FormControlExample />
                <SynchronizedForms />
            </div>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))