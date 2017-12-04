import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, NavLink, Route, Switch } from 'react-router-dom'
import GoogleAnalytics from 'react-ga';

import { FormProvider } from 'react-formctrl'
import { SubmitValuesPopup } from './components/submit-values'
import { Routes } from './routes'

import { CustomValidator } from 'react-formctrl/lib/validator'

import { AppLayout } from './layout/layout'

import './app.scss'

if (gaId) {
    GoogleAnalytics.initialize(gaId);
}

if (!window.Promise) {
    const Promise = require('promise-polyfill');
    window.Promise = Promise;
}

class NoAdminValidator extends CustomValidator {

    constructor() {
        super('noadmin')
    }

    validate(formCtrl, props, value, files) {
        return !/^admin$/i.test(value)
    }

}

function AppContent(props) {
    const url = props.match.url === '/' ? '' : props.match.url
    // console.debug('AppContent.render match.url', url)
    return (
        <AppLayout url={url}>
            <Routes {...props} />
        </AppLayout>
    )
}

export function App(props) {

    const customValidators = [
        new NoAdminValidator()
    ]

    return (
        <FormProvider validators={customValidators}>
            <HashRouter>
                <Switch>
                    <Route path="/branches/:branch" component={AppContent} />
                    <Route path="/" component={AppContent} />
                </Switch>
            </HashRouter>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))