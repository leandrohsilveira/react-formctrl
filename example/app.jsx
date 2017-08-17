import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Link} from 'react-router-dom'

import javascript from 'react-syntax-highlighter/dist/languages/javascript';
import json from 'react-syntax-highlighter/dist/languages/json';
import { registerLanguage } from "react-syntax-highlighter/dist/light"

import {FormProvider} from '../'
import {SubmitValuesPopup} from './submit-values'
import {Routes} from './routes'

import './app.scss'

export function App(props) {
    registerLanguage('javascript', javascript);
    registerLanguage('json', json);

    return (
        <FormProvider>
            <div>
                <SubmitValuesPopup />
                <div className="header">
                    <h1>ReactJS controlled forms</h1>
                    <p>react-formctrl is a lightweight forms controller library for ReactJS inspired by Angular forms and Redux forms.</p>
                </div>
                <HashRouter>
                    <div>
                        <div className="menu">
                            <Link to="/">Basic</Link>
                            &nbsp;
                            -
                            &nbsp;
                            <Link to="/more">More of basics</Link>
                            &nbsp;
                            -
                            &nbsp;
                            <Link to="/validation">Field validation</Link>
                            &nbsp;
                            -
                            &nbsp;
                            <Link to="/form-control">Form control</Link>
                            &nbsp;
                            -
                            &nbsp;
                            <Link to="/sync-form">Synchronized forms</Link>
                        </div>
                        <Routes />
                    </div>
                </HashRouter>
            </div>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))