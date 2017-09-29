import React from 'react'

import axios from 'axios'
import showdown from 'showdown'
showdown.setFlavor('github');

const converter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true
});

class Markdown extends React.Component {

    // componentDidMount() {
    //     const elements = document.querySelectorAll('.markdown pre code.language-jsx')
    //     elements.forEach(element => {

    //     })
    // }

    componentWillMount() {
        const {children} = this.props
        const html = converter.makeHtml(children)
        const markup = {__html: html}
        this.setState({markup})
    }

    render() {
        const {markup} = this.state
        return <div className="markdown" dangerouslySetInnerHTML={markup} />
    }
}

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