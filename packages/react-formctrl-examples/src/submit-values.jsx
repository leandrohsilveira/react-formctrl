import React from 'react'

const EVENT_NAME = 'react-formctrl.example.SubmitValuesPopup';

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
        const detail = {formName, values, files}
        const event = new CustomEvent(EVENT_NAME, {detail})
        document.dispatchEvent(event)
    }

    componentWillMount() {
        document.addEventListener(EVENT_NAME, this.handleShowSubmitValuesPopupEvent)    
    }

    componentWillUnmount() {
        document.removeEventListener(EVENT_NAME, this.handleShowSubmitValuesPopupEvent)
    }

    handleShowSubmitValuesPopupEvent(event) {
        const {formName, values, files} = event.detail
        if(this.state.timeout) {
            clearTimeout(this.state.timeout)
        }

        const timeout = setTimeout(this.close, 5000);

        this.setState({show: true, formName, values, timeout, files})
    }

    close() {
        if(this.state.timeout) {
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

    renderSelectedFiles(formFiles) {
        if(formFiles) {
            const fieldsNames = Object.keys(formFiles)
            if(fieldsNames.length) {
                return fieldsNames.map((fieldName) => {
                    let index = 0;
                    const output = []
                    const fieldFiles = formFiles[fieldName]
                    fieldFiles.item(file => {
                        const fileFieldKey = `${fieldName}[${index}]`
                        index++
                        output.push((
                            <li className="list-group-item" key={fileFieldKey}>
                                <strong>{fileFieldKey}</strong>: {file.name} - {file.size} byte(s).
                            </li>
                        ))
                    })
                    return output
                });
            }
        }
        return <li className="list-group-item">No files sent in submission</li>
    }

    render() {
        const {show, formName, values, files} = this.state
        return (
            <div className={`submit-values${show ? ' show' : ''}`}>
                <div className="card">
                    <div className="card-header">
                        <h3>Submited form: {formName}</h3>
                    </div>
                    <ul className="list-group list-group-flush">
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