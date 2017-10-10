import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, NavLink} from 'react-router-dom'
import GoogleAnalytics from 'react-ga';

import {FormProvider} from 'react-formctrl'
import {SubmitValuesPopup} from './components/submit-values'
import {Routes} from './routes'

import {CustomValidator} from 'react-formctrl/lib/validator'

import {AppLayout} from './layout/layout'

import './app.scss'

if(gaId) {
    GoogleAnalytics.initialize(gaId);
}

class NoAdminValidator extends CustomValidator {

    constructor() {
        super('noadmin')
    }

    validate(formCtrl, props, value, files) {
        return !/^admin$/i.test(value)
    }

}


export function App(props) {

    const customValidators = [
        new NoAdminValidator()
    ]

    return (
        <FormProvider validators={customValidators}>
            <HashRouter>
                <AppLayout>
                    <Routes />
                </AppLayout>
            </HashRouter>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))