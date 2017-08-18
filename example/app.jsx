import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, NavLink} from 'react-router-dom'

import javascript from 'react-syntax-highlighter/dist/languages/javascript';
import json from 'react-syntax-highlighter/dist/languages/json';
import { registerLanguage } from "react-syntax-highlighter/dist/light"

import {FormProvider} from 'react-formctrl'
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
                            <NavLink activeClassName="active" exact to="/">Basic</NavLink>
                            <NavLink activeClassName="active" to="/more">More of basics</NavLink>
                            <NavLink activeClassName="active" to="/validation">Field validation</NavLink>
                            <NavLink activeClassName="active" to="/form-control">Form control</NavLink>
                            <NavLink activeClassName="active" to="/sync-forms">Synchronized forms</NavLink>
                        </div>
                        <Routes />
                    </div>
                </HashRouter>
            </div>
        </FormProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))