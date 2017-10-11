import React from 'react'
import { Route, Switch } from 'react-router-dom'

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
import { AppBadges } from './components/badges'
import { AjaxGet } from './components/ajax'

import GoogleAnalytics from 'react-ga';

function SelectBranch({name, data = [{name: 'master'}], onChange, value = 'master'}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>Branch</label>
            <select name={name} id={name} className="form-control" onChange={(e) => onChange(e.target.value)} value={value}>
                {data.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                ))}
            </select>
        </div>
    )
}

class AnalyticsRoute extends React.Component {

    constructor(props) {
        super(props)
        this.track = this.track.bind(this)
        this.loadChildren = this.loadChildren.bind(this)
    }

    track(location) {
        if(gaId) {
            const page = location.pathname;
            console.debug(`Sending page view request to Google Analytics: ${page}`)
            const { options } = this.props
            GoogleAnalytics.set({
                page,
                ...options,
            });
            GoogleAnalytics.pageview(page);
        }
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

const github = {

    api: {
        url: 'https://api.github.com',
        getRepoUrl: (repo) => `${github.api.url}/repos/${repo || github.repo.path}`,
        getBranchesUrl: (repo) => `${github.api.getRepoUrl(repo)}/branches`
    },

    raw: {
        url: 'https://raw.githubusercontent.com',
        getRepoUrl: (repo) => `${github.raw.url}/${repo || github.repo.path}`,
        getBranchUrl: (repo, branch = 'master') => `${github.raw.getRepoUrl(repo)}/${branch}`
    },

    repo: {
        path: 'leandrohsilveira/react-formctrl',
        packages: {
            getLibUrl: (branch = 'master') => `${github.raw.getBranchUrl(github.repo.path, branch)}/packages/react-formctrl`,
            getExamplesUrl: (branch = 'master') => `${github.raw.getBranchUrl(github.repo.path, branch)}/packages/react-formctrl-examples`
        }
    }
}

export function Routes({history, match, location}) {
    console.debug('Routes.render location: ', location)

    const {params: {branch = 'master'}} = match
    const url = match.url === '/' ? '' : match.url
    const examplePath = 'src/cases'
    const rawExampleUrl = `${github.repo.packages.getExamplesUrl(branch)}/${examplePath}`
    const rawLibraryUrl = `${github.repo.packages.getLibUrl(branch)}`
    const handleChange = (value) => {
        const path = location.pathname.replace(match.url, '')
        console.log(path)
        if(value === 'master') return history.push(path)
        return history.push(`/branches/${value}/${path}`)
    }

    return (
        <div>
            <div style={{marginBottom: 15}}>
                <AjaxGet url={github.api.getBranchesUrl(github.repo.path)}>
                    <SelectBranch onChange={handleChange} value={branch} />
                </AjaxGet>
                <AppBadges branch={branch} />
            </div>

            <AnalyticsRoute exact path={`${url}/`}>
                <ReadMe path={`${rawLibraryUrl}/README.md`} />
            </AnalyticsRoute>

            <AnalyticsRoute exact path={`${url}/basic`}>
                <Case fileName={`${examplePath}/basic-form.jsx`} url={`${rawExampleUrl}/basic-form.jsx`}>
                    <BasicForm />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/more`}>
                <Case fileName={`${examplePath}/moreofbasic-form.jsx`} url={`${rawExampleUrl}/moreofbasic-form.jsx`}>
                    <MoreOfBasicForm />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/validation`}>
                <Case fileName={`${examplePath}/field-validation.jsx`} url={`${rawExampleUrl}/field-validation.jsx`}>
                    <FieldValidationForm />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/form-control`}>
                <Case fileName={`${examplePath}/form-control-example.jsx`} url={`${rawExampleUrl}/form-control-example.jsx`}>
                    <FormControlExample />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/sync-forms`}>
                <Case fileName={`${examplePath}/synchronized-forms.jsx`} url={`${rawExampleUrl}/synchronized-forms.jsx`}>
                    <SynchronizedForms />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/form-values-manipulation`}>
                <Case fileName={`${examplePath}/form-values-manipulation.jsx`} url={`${rawExampleUrl}/form-values-manipulation.jsx`}>
                    <FormValuesManipulationExample />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/users`}>
                <Case fileName={`${examplePath}/user-form.jsx`} url={`${rawExampleUrl}/user-form.jsx`}>
                    <UserFormApp />
                </Case>
            </AnalyticsRoute>

            <AnalyticsRoute path={`${url}/custom-validators`}>
                <Case fileName={`${examplePath}/custom-validators.jsx`} url={`${rawExampleUrl}/custom-validators.jsx`}>
                    <CustomValidatorExample />
                </Case>
            </AnalyticsRoute>


            <AnalyticsRoute path={`${url}/fields`}>
                <Case fileName={`${examplePath}/fields.jsx`} url={`${rawExampleUrl}/fields.jsx`}>
                    <FieldsExample />
                </Case>
            </AnalyticsRoute>
        </div>
    )
}