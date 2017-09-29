import React from 'react'
import axios from 'axios'
import {HighlightJsx, HighlightJson} from './highlight'
import {SubmitValuesPopup} from './submit-values'

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

export class Case extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            cancelTokenSource: axios.CancelToken.source()
        }
    }

    componentWillMount() {
        const { url } = this.props
        const requestConfig = {
            cancelToken: this.state.cancelTokenSource.token
        }
        axios.get(url, requestConfig)
            .then(response => {
                this.setState(state => ({ code: response.data }))
            })
            .catch(thrown => {
                if (axios.isCancel(thrown)) {
                    console.debug('Request canceled: ', thrown.message)
                } else {
                    console.error(thrown)
                }
            })
    }

    componentWillUnmount() {
        this.state.cancelTokenSource.cancel('Component\'s request source unmounted.')
    }

    render() {
        const { children, fileName } = this.props
        const { code } = this.state
        return (
            <div className="case clearfix">
                <SubmitValuesPopup></SubmitValuesPopup>
                <div className="case-display">
                    {children}
                </div>
                <div className="case-code">
                    <div className="card">
                        <div className="card-header">
                            <h4>Code: <small>{fileName}</small></h4>
                        </div>
                        <div className="card-body">
                            {code !== '' && (
                                <HighlightJsx>
                                    {code}
                                </HighlightJsx>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }

}