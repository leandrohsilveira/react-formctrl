import React from 'react'

import {Navbar, NavbarItem, NavbarDropdown, NavbarDropdownItem, NavbarDropdownHeader, NavbarDropdownDivider} from '../components/navbar'

export function AppMenu() {
    return (
        <Navbar id="appMenuNavbar" title="RFCTRL" containerClassName="container">
            <NavbarItem to="/">Home</NavbarItem>
            <NavbarItem to="/fields">Fields usage</NavbarItem>
            <NavbarDropdown text="Examples">
                <NavbarDropdownHeader>Basics</NavbarDropdownHeader>
                <NavbarDropdownItem to="/basic">Simple</NavbarDropdownItem>
                <NavbarDropdownItem to="/more">More of basics</NavbarDropdownItem>
                <NavbarDropdownDivider />

                <NavbarDropdownHeader>Validation</NavbarDropdownHeader>
                <NavbarDropdownItem to="/validation">Field validation</NavbarDropdownItem>
                <NavbarDropdownItem to="/custom-validators">Custom validators example</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader>Controlling</NavbarDropdownHeader>
                <NavbarDropdownItem to="/form-control">Form control</NavbarDropdownItem>
                <NavbarDropdownItem to="/form-values-manipulation">Form values manipulation</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader>Misc</NavbarDropdownHeader>
                <NavbarDropdownItem to="/sync-forms">Synchronized forms</NavbarDropdownItem>
                <NavbarDropdownItem to="/users">Complete user form example</NavbarDropdownItem>
            </NavbarDropdown>
        </Navbar>
    )
}