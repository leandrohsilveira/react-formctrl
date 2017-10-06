import React from 'react'
import { Route } from 'react-router-dom'

import { Case } from './components/case'

import { BasicForm } from './cases/basic-form'
import { MoreOfBasicForm } from './cases/moreofbasic-form'
import { FieldValidationForm } from './cases/field-validation'
import { FormControlExample } from './cases/form-control-example'
import { SynchronizedForms } from './cases/synchronized-forms'
import { FormValuesManipulationExample } from './cases/form-values-manipulation'
import { UserFormApp } from './cases/user-form'
import { CustomValidatorExample } from './cases/custom-validators'
import { FieldsExample } from './cases/fields'
import { ReadMe } from './components/read-me'

import GoogleAnalytics from 'react-ga';

class AnalyticsRoute extends React.Component {

    constructor(props) {
        super(props)
        this.track = this.track.bind(this)
        this.loadChildren = this.loadChildren.bind(this)
    }

    track(location) {
        const page = location.pathname;
        console.debug(`Sending page view request to Google Analytics: ${page}`)
        const { options } = this.props
        GoogleAnalytics.set({
            page,
            ...options,
        });
        GoogleAnalytics.pageview(page);
    }

    loadChildren(props, child) {
        this.track(props.location)
        return React.cloneElement(child, { ...child.props, ...props })
    }

    render() {
        const {path, exact, children} = this.props
        return (
            <Route path={path} exact={exact} render={(_props) => this.loadChildren(_props, children)} />
        )
    }

}

export function Routes({ branch = 'master' }) {
    const rootUrl = `https://raw.githubusercontent.com/leandrohsilveira/react-formctrl/${branch}`

    const examplePath = 'react-formctrl-examples/src/cases'
    const rawExampleUrl = `${rootUrl}/packages/${examplePath}`
    const rawLibraryUrl = `${rootUrl}/packages/react-formctrl`
    return (
        <Route path="/" render={({location}) => (
            <div>
                <AnalyticsRoute location={location} exact path="/">
                    <ReadMe path={`${rawLibraryUrl}/README.md`} />
                </AnalyticsRoute>

                <AnalyticsRoute location={location} exact path="/basic">
                    <Case fileName={`${examplePath}/basic-form.jsx`} url={`${rawExampleUrl}/basic-form.jsx`}>
                        <BasicForm />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/more">
                    <Case fileName={`${examplePath}/moreofbasic-form.jsx`} url={`${rawExampleUrl}/moreofbasic-form.jsx`}>
                        <MoreOfBasicForm />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/validation">
                    <Case fileName={`${examplePath}/field-validation.jsx`} url={`${rawExampleUrl}/field-validation.jsx`}>
                        <FieldValidationForm />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/form-control">
                    <Case fileName={`${examplePath}/form-control-example.jsx`} url={`${rawExampleUrl}/form-control-example.jsx`}>
                        <FormControlExample />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/sync-forms">
                    <Case fileName={`${examplePath}/synchronized-forms.jsx`} url={`${rawExampleUrl}/synchronized-forms.jsx`}>
                        <SynchronizedForms />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/form-values-manipulation">
                    <Case fileName={`${examplePath}/form-values-manipulation.jsx`} url={`${rawExampleUrl}/form-values-manipulation.jsx`}>
                        <FormValuesManipulationExample />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/users">
                    <Case fileName={`${examplePath}/user-form.jsx`} url={`${rawExampleUrl}/user-form.jsx`}>
                        <UserFormApp />
                    </Case>
                </AnalyticsRoute>

                <AnalyticsRoute location={location} path="/custom-validators">
                    <Case fileName={`${examplePath}/custom-validators.jsx`} url={`${rawExampleUrl}/custom-validators.jsx`}>
                        <CustomValidatorExample />
                    </Case>
                </AnalyticsRoute>
                <AnalyticsRoute location={location} path="/fields">
                    <Case fileName={`${examplePath}/fields.jsx`} url={`${rawExampleUrl}/fields.jsx`}>
                        <FieldsExample />
                    </Case>
                </AnalyticsRoute>
            </div>

        )} />
    )
}