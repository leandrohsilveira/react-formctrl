import React from 'react'
import { Link as RLink } from 'react-router-dom'

import './navbar.scss'

export function Link({className, onClick, to, external=false, target, children}) {
    if(external) return <a href={to} className={className} onClick={onClick} target={target}>{children}</a>
    else return <RLink to={to} className={className} onClick={onClick} target={target}>{children}</RLink>
}

export function NavbarItem({to, icon, onClick, external, children}) {
    return (
        <li className="nav-item">
            <Link className="nav-link" onClick={onClick} to={to} external={external}>
                {!!icon && <i className={`fa fa-${icon}`} style={{marginRight: 5}}></i>}
                {children}
            </Link>
        </li>
    )
}

export function NavbarDropdownDivider() {
    return <div className="dropdown-divider"></div>
}

export function NavbarDropdownHeader({icon, children}) {
    return (
        <h6 className="dropdown-header">
            {!!icon && <i className={`fa fa-${icon}`} style={{marginRight: 5}}></i>}
            {children}
        </h6>
    )
}

export function NavbarDropdownItem({to, onClick, icon, external, children}) {
    return (
        <Link className="dropdown-item" to={to} onClick={onClick} external={external}>
            {!!icon && <i className={`fa fa-${icon}`} style={{marginRight: 5}}></i>}
            {children}
        </Link>
    )
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
            const clickHandler = () => {
                this.handleToggleClick()
                this.props.onClick()
            }
            return React.cloneElement(child, {...child.props, onClick: clickHandler})
        }
        return child
    }

    handleToggleClick() {
        this.setState({open: !this.state.open})
    }

    render() {
        const {text, icon, children} = this.props
        const dropdownItems = React.Children.map(children, child => this.injectClickEvent(child))
        return (
            <li className={this.getToggleClass('nav-item dropdown')}>
                <a href="javascript:void(0)" onClick={this.handleToggleClick} className="nav-link dropdown-toggle">
                    {!!icon && <i className={`fa fa-${icon}`} style={{marginRight: 5}}></i>}
                    {text}
                </a>
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
            return 'navbar-toggler show'
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
                            <div></div>
                            <div></div>
                            <div></div>
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