import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, NavLink} from 'react-router-dom'

import javascript from 'react-syntax-highlighter/dist/languages/javascript'
import json from 'react-syntax-highlighter/dist/languages/json';
import { registerLanguage } from "react-syntax-highlighter/dist/light"

import {FormProvider} from 'react-formctrl'
import {SubmitValuesPopup} from './submit-values'
import {Routes} from './routes'

import {AppLayout} from './layout/layout'

import './app.scss'

export function App(props) {
    registerLanguage('javascript', javascript);
    registerLanguage('json', json);

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