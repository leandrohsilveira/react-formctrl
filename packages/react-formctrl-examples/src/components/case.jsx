import React from 'react'
import {HighlightJsx, HighlightJson} from './highlight'
import {SubmitValuesPopup} from './submit-values'
import {AjaxGet} from '../components/ajax'

export function Json({ json, title, maxHeight, children }) {
    let content = json
    const style = {}
    if(maxHeight) {
        style.height = maxHeight
        style.overflowY = 'auto'
    }
    if (typeof content === 'object') content = JSON.stringify(content, null, 4)
    return (
        <div className="json-code">
            <div className="row">
                {children !== undefined && (
                    <div className="col">
                        <div className="json-children">
                            {children}
                        </div>
                    </div>
                )}
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h4><small>{title}</small></h4>
                        </div>
                        <div className="card-body">
                            <div style={style}>
                                <HighlightJson>
                                    {content}
                                </HighlightJson>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HighlightRemoteCode({data}) {
    if(data) {
        return (
            <HighlightJsx>
                {data}
            </HighlightJsx>
        )
    }
    return <div>Loading code example from GitHub...</div>
}

export class Case extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            code: ''
        }
    }

    render() {
        const { children, fileName, url } = this.props
        const { code } = this.state
        return (
            <div className="case clearfix">
                <SubmitValuesPopup></SubmitValuesPopup>
                <div className="case-display">
                    {React.cloneElement(children, { ...children.props, ...this.props })}
                </div>
                <div className="case-code">
                    <div className="card">
                        <div className="card-header">
                            <h4>Code: <small>{fileName}</small></h4>
                        </div>
                        <div className="card-body">
                            <AjaxGet url={url}>
                                <HighlightRemoteCode />
                            </AjaxGet>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }

}