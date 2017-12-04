import React from 'react'
import { dispatchEvent } from 'react-formctrl'

const EVENT_NAME = 'react-formctrl.example.SubmitValuesPopup';

import './submit-values.scss'

export class SubmitValuesPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            formName: null,
            values: {},
            files: {},
            timeout: null
        }
        this.handleShowSubmitValuesPopupEvent = this.handleShowSubmitValuesPopupEvent.bind(this)
        this.close = this.close.bind(this)
    }

    static dispatchShowSubmitValuesPopupEvent(formName, values, files) {
        const payload = { formName, values, files }
        dispatchEvent(EVENT_NAME, payload)
    }

    componentWillMount() {
        document.addEventListener(EVENT_NAME, this.handleShowSubmitValuesPopupEvent)
    }

    componentWillUnmount() {
        document.removeEventListener(EVENT_NAME, this.handleShowSubmitValuesPopupEvent)
    }

    handleShowSubmitValuesPopupEvent(event) {
        const { formName, values, files } = event.detail
        if (this.state.timeout) {
            clearTimeout(this.state.timeout)
        }

        const timeout = setTimeout(this.close, 5000);

        this.setState({ show: true, formName, values, timeout, files })
    }

    close() {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout)
        }
        this.setState(state => ({
            show: false,
            formName: null,
            values: {},
            files: {},
            timeout: null
        }))
    }

    renderSelectedFiles(files) {
        if (files) {
            const fieldsNames = Object.keys(files)
            if (fieldsNames.length) {
                return fieldsNames.map((fieldName) => files[fieldName].map((file, index) => {
                    const fieldNameIndex = `${fieldName}[${index}]`
                    return (
                        <li className="list-group-item" key={fieldNameIndex}>
                            <strong>{fieldNameIndex}</strong>: {file.name} - {file.size} byte(s).
                        </li>
                    )
                }))
            }
        }
        return <li className="list-group-item">No files sent in submission</li>



    }

    render() {
        const { show, formName, values, files } = this.state
        return (
            <div className={`submit-values${show ? ' show' : ''}`}>
                <div className="card">
                    <div className="card-header">
                        <h3>Submited form: {formName}</h3>
                    </div>
                    <ul className="list-group list-group-flush" style={{ maxHeight: 500, overflowY: 'auto' }}>
                        <li className="list-group-item">
                            <h4>Values</h4>
                        </li>
                        {(!values || values.length === 0) && (
                            <li className="list-group-item">No values sent in submission</li>
                        )}
                        {values && Object.keys(values).map(field => (
                            <li className="list-group-item" key={field}>
                                <strong>{field}</strong>: {values[field]}
                            </li>
                        ))}
                        <li className="list-group-item">
                            <h4>Files</h4>
                        </li>
                        {this.renderSelectedFiles(files)}
                    </ul>
                    <div className="card-body">
                        <button type="button" className="btn btn-primary" onClick={this.close}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

}