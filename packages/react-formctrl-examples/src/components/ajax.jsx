import React from 'react'

import axios from 'axios'

export class AjaxGet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null,
            cancelTokenSource: axios.CancelToken.source()
        }
        this.request = this.request.bind(this)
        this.handleRefresh = this.handleRefresh.bind(this)
    }

    componentWillMount() {
        const {url} = this.props
        this.request(url)
    }

    componentWillReceiveProps(nextProps) {
        const {url} = this.props
        if(nextProps.url !== url) this.handleRefresh(nextProps.url)
    }

    componentWillUnmount() {
        this.state.cancelTokenSource.cancel('Component\'s request source unmounted.')
    }

    request(url) {
        const {onError} = this.props
        const requestConfig = {
            cancelToken: this.state.cancelTokenSource.token
        }
        axios.get(url, requestConfig)
            .then(({data}) => this.setState(state => ({data})))
            .catch(error => onError ? onError(error) : console.error(error))
    }

    handleRefresh(url) {
        this.setState(state => {
            this.request(url)
            return {data: null}
        })
    }

    render() {
        const {data} = this.state
        const {url, children} = this.props
        if(data) {
            return React.cloneElement(children, { ...children.props, data, refresh: () => this.handleRefresh(url) })
        }
        return children
    }

}