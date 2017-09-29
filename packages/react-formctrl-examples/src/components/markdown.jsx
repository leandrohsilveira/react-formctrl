import React from 'react'

import Prism from 'prismjs'
import showdown from 'showdown'

showdown.setFlavor('github');

const converter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true
});

export class Markdown extends React.Component {

    componentDidMount() {
        const elements = document.querySelectorAll('.markdown pre code.language-jsx')
        elements.forEach(element => {
            const code = Prism.highlight(element.innerText, Prism.languages.jsx)
            element.innerHTML = code
        })
    }

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