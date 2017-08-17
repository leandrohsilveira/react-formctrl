import React from 'react'
import axios from 'axios'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';
import { tomorrowNight as theme } from 'react-syntax-highlighter/dist/styles';

export function Json({json, title, children}) {
    let content = json
    if(typeof content === 'object') content = JSON.stringify(content, null, 4)
    return (
        <div className="json-code">
            {children !== undefined && (
                <div className="json-children">
                    {children}
                </div>
            )}
            <h4><small>{title}</small></h4>
            <SyntaxHighlighter language="json" style={theme}>
                {content}
            </SyntaxHighlighter>
        </div>
    )
}

export class Case extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            code: ''
        }
    }

    componentWillMount() {
        const {url} = this.props
        axios.get(url).then(response => {
            this.setState(state => ({code: response.data}))
        })
    }

    render() {
        const {children, fileName} = this.props
        const {code} = this.state
        return (
            <div className="case">
                <div className="case-display">
                    {children}
                </div>
                {code !== '' && (
                    <div className="case-code">
                        <h4>Code: <small>{fileName}</small></h4>
                        <SyntaxHighlighter showLineNumbers={true} language="javascript" style={theme}>
                            {code}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        )
    }

}