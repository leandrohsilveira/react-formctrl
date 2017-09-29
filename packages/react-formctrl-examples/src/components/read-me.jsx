import React from 'react'

import axios from 'axios'

import {Markdown} from './markdown'

export class ReadMe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }

    componentWillMount() {
        const { path } = this.props
        axios.get(path)
            .then(response => this.setState({ content: response.data }))
    }

    render() {
        if (this.state.content) {
            return (
                <Markdown>
                    {this.state.content}
                </Markdown>
            )
        }
        return null
    }
}