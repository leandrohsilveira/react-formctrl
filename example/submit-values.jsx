import React from 'react'

const EVENT_NAME = 'react-formctrl.example.SubmitValuesPopup';

export class SubmitValuesPopup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            name: null,
            values: {},
            timeout: null
        }
        this.handleShowSubmitValuesPopupEvent = this.handleShowSubmitValuesPopupEvent.bind(this)
    }

    static dispatchShowSubmitValuesPopupEvent(name, values) {
        const detail = {name, values}
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
        const {name, values} = event.detail
        if(this.state.timeout) {
            clearTimeout(this.state.timeout)
        }

        const timeout = setTimeout(() => {
            this.setState(state => ({
                show: false,
                name: null,
                values: {},
                timeout: null
            }))
        }, 5000);

        this.setState({show: true, name, values, timeout})
    }

    render() {
        const {show, name, values} = this.state
        const style = {
            display: show ? 'block' : 'none',
            position: 'fixed',
            right: 0,
            top: 0,
            border: '1px solid black',
            backgroundColor: 'white',
            padding: 10
        }

        return (
            <div style={style}>
                <h3>Submited form: {name}</h3>
                <ul>
                    {(!values || values.length === 0) && (
                        <li>No values sent in submission</li>
                    )}
                    {values && Object.keys(values).map(field => (
                        <li>
                            <strong>{field}</strong>: {values[field]}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

}