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
        const {id, title, className = 'fixed-top navbar-dark bg-primary', children} = this.props
        const {open} = this.state

        const navbarItems = React.Children.map(children, child => React.cloneElement(child, {...child.props, onClick: this.handleToggleNavbarClick}))

        return (
            <nav className={`navbar navbar-expand-md ${className}`}>
                <a className="navbar-brand" href="#">{title}</a>
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
            </nav>
        )
    }
}