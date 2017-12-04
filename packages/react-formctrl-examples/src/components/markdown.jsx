import React from 'react'

import Prism from 'prismjs'
import showdown from 'showdown'

showdown.setFlavor('github');

const converter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true
});

import './markdown.scss'

export class Markdown extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const elements = document.querySelectorAll('.markdown pre code.language-jsx')
        if (elements.forEach) {
            elements.forEach(this.applyPrism)
        } else if (elements.item) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements.item(i)
                this.applyPrism(element)
            }
        }

    }

    componentWillMount() {
        const { children } = this.props
        const html = converter.makeHtml(children)
        const markup = { __html: html }
        this.setState({ markup })
    }

    applyPrism(element) {
        const code = Prism.highlight(element.innerText, Prism.languages.jsx)
        element.innerHTML = code
    }

    render() {
        const { markup } = this.state
        return <div className="markdown" dangerouslySetInnerHTML={markup} />
    }
}