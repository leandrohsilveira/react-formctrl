import React from 'react'
import { Link } from 'react-router-dom'

import './navbar.scss'

export function NavbarItem({to, onClick, children}) {
    return (
        <li className="nav-item">
            <Link className="nav-link" onClick={onClick} to={to}>{children}</Link>
        </li>
    )
}

export function NavbarDropdownDivider() {
    return <div className="dropdown-divider"></div>
}

export function NavbarDropdownHeader({children}) {
    return <h6 className="dropdown-header">{children}</h6>
}

export function NavbarDropdownItem({to, onClick, children}) {
    return <Link className="dropdown-item" to={to} onClick={onClick}>{children}</Link>
}

export class NavbarDropdown extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }

        this.getToggleClass = this.getToggleClass.bind(this)
        this.handleToggleClick = this.handleToggleClick.bind(this)
        this.injectClickEvent = this.injectClickEvent.bind(this)
    }

    getToggleClass(className) {
        if(this.state.open) {
            return `${className} show`
        } else {
            return className
        }
    }

    injectClickEvent(child) {
        if(child.type === NavbarDropdownItem) {
            return React.cloneElement(child, {...child.props, onClick: this.handleToggleClick})
        }
        return child
    }

    handleToggleClick() {
        this.setState({open: !this.state.open})
    }

    render() {
        const {text, children} = this.props
        const dropdownItems = React.Children.map(children, child => this.injectClickEvent(child))
        return (
            <li className={this.getToggleClass('nav-item dropdown')}>
                <div className="backdrop" onClick={this.handleToggleClick}></div>
                <a href="javascript:void(0)" onClick={this.handleToggleClick} className="nav-link dropdown-toggle">{text}</a>
                <div className={this.getToggleClass('dropdown-menu')}>
                    {dropdownItems}
                </div>
            </li>
        )
    }
}

export class Navbar extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }

        this.getNavbarTogglerClasses = this.getNavbarTogglerClasses.bind(this)
        this.handleToggleNavbarClick = this.handleToggleNavbarClick.bind(this)
        this.getNavbarCollapseClasses = this.getNavbarCollapseClasses.bind(this)
    }
    
    handleToggleNavbarClick() {
        this.setState({open: !this.state.open})
    }

    getNavbarTogglerClasses() {
        const {open} = this.state
        if(open) {
            return 'navbar-toggler'
        } else {
            return 'navbar-toggler collapsed'
        }
    }

    getNavbarCollapseClasses() {
        const {open} = this.state
        if (open) {
            return 'collapse show'
        } else {
            return 'collapse'
        }
    }

    render() {
        const {id, title, className = 'sticky-top navbar-dark bg-primary', containerClassName, children} = this.props
        const {open} = this.state

        const navbarItems = React.Children.map(children, child => React.cloneElement(child, {...child.props, onClick: this.handleToggleNavbarClick}))

        return (
            <nav className={`navbar navbar-expand-md ${className}`}>
                <div className={containerClassName}>
                    {!!title && (
                        <a className="navbar-brand" href="#">{title}</a>
                    )}
                    <button type="button" 
                            className={this.getNavbarTogglerClasses()} 
                            data-toggle="collapse" 
                            data-target={`#${id}`} 
                            aria-controls={id} 
                            aria-expanded={open+''} 
                            onClick={this.handleToggleNavbarClick}
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
            
                    <div className={`navbar-collapse ${this.getNavbarCollapseClasses()}`} id={id}>
                        <ul className="navbar-nav mr-auto">
                            {navbarItems}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}