import React from 'react'

import PropTypes from 'prop-types'

import { onRegisterValidators } from './provider.actions'
import { formProviderReducer } from './provider.reducer'

const DEFAULT_STATE = {
    forms: {},
    validators: {}
}

const { Provider, Consumer: FormConsumer } = React.createContext(DEFAULT_STATE)

class FormProvider extends React.Component {

    static propTypes = {
        customValidators: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            validate: PropTypes.func.isRequired
        }))
    }

    constructor(props) {
        super(props)
        this.dispatch = this.dispatch.bind(this)
        this.state = {
            ...DEFAULT_STATE,
            dispatch: this.dispatch
        }
    }

    componentWillMount() {
        const { validators = [] } = this.props
        this.dispatch(onRegisterValidators(validators));
    }

    dispatch(action) {
        return new Promise(resolve => {
            this.setState(
                state => formProviderReducer(state, action),
                () => {
                    resolve(this.state.forms)
                }
            )
        })
    }

    render() {
        const { children } = this.props
        return (
            <Provider value={this.state}>
                {children}
            </Provider>
        )
    }

}

export { FormConsumer, FormProvider };