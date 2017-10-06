import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, NavLink} from 'react-router-dom'
import GoogleAnalytics from 'react-ga';

import {FormProvider} from 'react-formctrl'
import {SubmitValuesPopup} from './components/submit-values'
import {Routes} from './routes'

import {AppLayout} from './layout/layout'

import './app.scss'

GoogleAnalytics.initialize('UA-107666080-1');

export function App(props) {

    const customValidators = [{
        name: 'noadmin',
        validate: (value) => {
            if(value) return !(/^admin$/i.test(value))
            return true
        }
    }]

    return (
        <FormProvider customValidators={customValidators}>
            <HashRouter>
                <AppLayout>
                    <Routes />
                </AppLayout>
            </HashRouter>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))