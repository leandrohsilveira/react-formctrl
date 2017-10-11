import React from 'react'

import {Navbar, NavbarItem, NavbarDropdown, NavbarDropdownItem, NavbarDropdownHeader, NavbarDropdownDivider} from '../components/navbar'

import GoogleAnalytics from 'react-ga'

import {composeUrl} from '../utils/url.utils'

const CHANGE_TITLE_EVENT = 'react-formctrl-examples.changeTitle'

export class AppMenuEventDispatcher {

    static changeTitle(title, page, pageProps) {
        const event = new CustomEvent(CHANGE_TITLE_EVENT, {detail: {title, page, pageProps}})
        document.dispatchEvent(event)
    }
}

export class AppMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            title: 'RFCTRL'
        }
        this.changeTitle = this.changeTitle.bind(this)
    }

    componentWillMount() {
        document.addEventListener(CHANGE_TITLE_EVENT, this.changeTitle)
    }
    
    componentWillUnmount() {
        document.removeEventListener(CHANGE_TITLE_EVENT, this.changeTitle)
    }

    changeTitle({detail: {title, page, pageProps}}) {
        const _title = `RFCTRL - ${title}`
        document.title = _title
        if(gaId) {
            GoogleAnalytics.set({
                page,
                ...pageProps,
            });
            GoogleAnalytics.pageview(page);
        }
        this.setState(state =>({title: _title}))
    }

    render() {
        const {url} = this.props
        const {title = 'RFCTRL'} = this.state
        return (
            <Navbar id="appMenuNavbar" expand="lg" title={title}>
                <NavbarItem to={composeUrl(url, '')} icon="home">Home</NavbarItem>
                <NavbarItem to={composeUrl(url, 'fields')} icon="list">Fields usage</NavbarItem>
                <NavbarDropdown text="Examples" icon="code">
                    <NavbarDropdownHeader icon="hand-peace-o">Basics</NavbarDropdownHeader>
                    <NavbarDropdownItem to={composeUrl(url, 'basic')}>Simple</NavbarDropdownItem>
                    <NavbarDropdownItem to={composeUrl(url, 'more')}>More of basics</NavbarDropdownItem>
                    <NavbarDropdownDivider />
    
                    <NavbarDropdownHeader icon="check-circle">Validation</NavbarDropdownHeader>
                    <NavbarDropdownItem to={composeUrl(url, 'validation')}>Field validation</NavbarDropdownItem>
                    <NavbarDropdownItem to={composeUrl(url, 'custom-validators')}>Custom validators example</NavbarDropdownItem>
                    <NavbarDropdownDivider />
                    
                    <NavbarDropdownHeader icon="keyboard-o">Controlling</NavbarDropdownHeader>
                    <NavbarDropdownItem to={composeUrl(url, 'form-control')}>Form control</NavbarDropdownItem>
                    <NavbarDropdownItem to={composeUrl(url, 'form-values-manipulation')}>Form values manipulation</NavbarDropdownItem>
                    <NavbarDropdownDivider />
                    
                    <NavbarDropdownHeader icon="ellipsis-h">Misc</NavbarDropdownHeader>
                    <NavbarDropdownItem to={composeUrl(url, 'sync-forms')}>Synchronized forms</NavbarDropdownItem>
                    <NavbarDropdownItem to={composeUrl(url, 'users')}>Complete user form example</NavbarDropdownItem>
                </NavbarDropdown>
                <NavbarItem to={`https://github.com/leandrohsilveira/react-formctrl`} icon="github" external>GitHub Repository</NavbarItem>
            </Navbar>
        )
    }
}