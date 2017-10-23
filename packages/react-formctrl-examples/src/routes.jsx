import React from 'react'
import { Route as ReactRoute, Switch } from 'react-router-dom'

import { Case } from './components/case'
import { ReadMe } from './components/read-me'
import { AppBadges } from './components/badges'
import { AjaxGet } from './components/ajax'
import { Page } from './components/page'
import { SelectBranch } from './components/select-branch'

import { BasicForm } from './cases/basic-form'
import { MoreOfBasicForm } from './cases/moreofbasic-form'
import { FieldValidationForm } from './cases/field-validation'
import { FormControlExample } from './cases/form-control-example'
import { SynchronizedForms } from './cases/synchronized-forms'
import { FormValuesManipulationExample } from './cases/form-values-manipulation'
import { UserFormApp } from './cases/user-form'
import { CustomValidatorExample } from './cases/custom-validators'
import { FieldsExample } from './cases/fields'

import {composeUrl} from './utils/url.utils'

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

function Route({ title, base, path, exact, children }) {
    return <ReactRoute path={composeUrl(base, path)} exact={exact} render={(_props) => (
        <Page title={title} location={_props.location}>
            {React.cloneElement(children, { ...children.props, ..._props })}
        </Page>
    )} />
}

export function Routes({ history, match, location }) {
    const { params: { branch = 'master' } } = match

    const url = match.url === '/' ? '' : match.url
    const examplePath = 'src/cases'

    const rawExampleUrl = `${github.repo.packages.getExamplesUrl(branch)}/${examplePath}`
    const rawLibraryUrl = `${github.repo.packages.getLibUrl(branch)}`

    const handleChange = (value) => {
        const path = location.pathname.replace(match.url, '')
        if (value === 'master') return history.push(path)
        return history.push(`/branches/${composeUrl(value, path)}`)
    }

    return (
        <div>
            <div style={{ marginBottom: 15 }}>
                <AjaxGet url={github.api.getBranchesUrl(github.repo.path)}>
                    <SelectBranch onChange={handleChange} value={branch} />
                </AjaxGet>
                <AppBadges branch={branch} />
            </div>

            <Route base={url} title="Read me" exact path="/">
                <ReadMe path={`${rawLibraryUrl}/README.md`} />
            </Route>

            <Route base={url} title="Basic form example" exact path="basic">
                <Case fileName={`${examplePath}/basic-form.jsx`} url={`${rawExampleUrl}/basic-form.jsx`}>
                    <BasicForm />
                </Case>
            </Route>

            <Route base={url} title="Basic form example 2" path="more">
                <Case fileName={`${examplePath}/moreofbasic-form.jsx`} url={`${rawExampleUrl}/moreofbasic-form.jsx`}>
                    <MoreOfBasicForm />
                </Case>
            </Route>

            <Route base={url} title="Field validation example" path="validation">
                <Case fileName={`${examplePath}/field-validation.jsx`} url={`${rawExampleUrl}/field-validation.jsx`}>
                    <FieldValidationForm />
                </Case>
            </Route>

            <Route base={url} title="FormControl usage" path="form-control">
                <Case fileName={`${examplePath}/form-control-example.jsx`} url={`${rawExampleUrl}/form-control-example.jsx`}>
                    <FormControlExample />
                </Case>
            </Route>

            <Route base={url} title="Synchronized forms" path="sync-forms">
                <Case fileName={`${examplePath}/synchronized-forms.jsx`} url={`${rawExampleUrl}/synchronized-forms.jsx`}>
                    <SynchronizedForms />
                </Case>
            </Route>

            <Route base={url} title="Form values manipulation" path="form-values-manipulation">
                <Case fileName={`${examplePath}/form-values-manipulation.jsx`} url={`${rawExampleUrl}/form-values-manipulation.jsx`}>
                    <FormValuesManipulationExample />
                </Case>
            </Route>

            <Route base={url} title="User form example" path="users">
                <Case fileName={`${examplePath}/user-form.jsx`} url={`${rawExampleUrl}/user-form.jsx`}>
                    <UserFormApp />
                </Case>
            </Route>

            <Route base={url} title="Custom validators example" path="custom-validators">
                <Case fileName={`${examplePath}/custom-validators.jsx`} url={`${rawExampleUrl}/custom-validators.jsx`}>
                    <CustomValidatorExample />
                </Case>
            </Route>

            <Route base={url} title="Fields usage" path="fields">
                <Case fileName={`${examplePath}/fields.jsx`} url={`${rawExampleUrl}/fields.jsx`}>
                    <FieldsExample />
                </Case>
            </Route>

        </div>
    )
}