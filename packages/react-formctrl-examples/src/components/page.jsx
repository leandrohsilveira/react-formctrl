import React from 'react'

import {AppMenuEventDispatcher} from '../layout/menu'

export class Page extends React.Component {

    componentDidMount() {
        const {title, location} = this.props
        AppMenuEventDispatcher.changeTitle(title, location.pathname)
    }

    render() {
        return this.props.children
    }
}