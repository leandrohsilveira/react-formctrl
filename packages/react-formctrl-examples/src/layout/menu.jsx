import React from 'react'

import {Navbar, NavbarItem} from '../components/navbar'

export function AppMenu() {
    return (
        <Navbar id="appMenuNavbar" title="react-formctrl">
            <NavbarItem to="/">Basic</NavbarItem>
            <NavbarItem to="/more">More of basics</NavbarItem>
            <NavbarItem to="/validation">Field validation</NavbarItem>
            <NavbarItem to="/form-control">Form control</NavbarItem>
            <NavbarItem to="/sync-forms">Synchronized forms</NavbarItem>
            <NavbarItem to="/form-values-manipulation">Form values manipulation</NavbarItem>
            <NavbarItem to="/users">Complete user form example</NavbarItem>
            <NavbarItem to="/custom-validators">Custom validators example</NavbarItem>
        </Navbar>
    )
}