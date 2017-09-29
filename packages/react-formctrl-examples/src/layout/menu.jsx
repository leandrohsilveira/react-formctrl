import React from 'react'

import {Navbar, NavbarItem, NavbarDropdown, NavbarDropdownItem} from '../components/navbar'

export function AppMenu() {
    return (
        <Navbar id="appMenuNavbar" title="RFCTRL" containerClassName="container">
            <NavbarItem to="/">Home</NavbarItem>
            <NavbarItem to="/fields">Fields usage</NavbarItem>
            <NavbarDropdown text="Examples">
                <NavbarDropdownItem to="/basic">Basic</NavbarDropdownItem>
                <NavbarDropdownItem to="/more">More of basics</NavbarDropdownItem>
                <NavbarDropdownItem to="/validation">Field validation</NavbarDropdownItem>
                <NavbarDropdownItem to="/form-control">Form control</NavbarDropdownItem>
                <NavbarDropdownItem to="/sync-forms">Synchronized forms</NavbarDropdownItem>
                <NavbarDropdownItem to="/form-values-manipulation">Form values manipulation</NavbarDropdownItem>
                <NavbarDropdownItem to="/users">Complete user form example</NavbarDropdownItem>
                <NavbarDropdownItem to="/custom-validators">Custom validators example</NavbarDropdownItem>
            </NavbarDropdown>
        </Navbar>
    )
}