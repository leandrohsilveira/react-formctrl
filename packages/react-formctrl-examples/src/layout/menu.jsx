import React from 'react'

import {Navbar, NavbarItem, NavbarDropdown, NavbarDropdownItem, NavbarDropdownHeader, NavbarDropdownDivider} from '../components/navbar'

export function AppMenu() {
    return (
        <Navbar id="appMenuNavbar" title="RFCTRL" containerClassName="container">
            <NavbarItem to="/" icon="home">Home</NavbarItem>
            <NavbarItem to="/fields" icon="list">Fields usage</NavbarItem>
            <NavbarDropdown text="Examples" icon="code">
                <NavbarDropdownHeader icon="hand-peace-o">Basics</NavbarDropdownHeader>
                <NavbarDropdownItem to="/basic">Simple</NavbarDropdownItem>
                <NavbarDropdownItem to="/more">More of basics</NavbarDropdownItem>
                <NavbarDropdownDivider />

                <NavbarDropdownHeader icon="check-circle">Validation</NavbarDropdownHeader>
                <NavbarDropdownItem to="/validation">Field validation</NavbarDropdownItem>
                <NavbarDropdownItem to="/custom-validators">Custom validators example</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader icon="keyboard-o">Controlling</NavbarDropdownHeader>
                <NavbarDropdownItem to="/form-control">Form control</NavbarDropdownItem>
                <NavbarDropdownItem to="/form-values-manipulation">Form values manipulation</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader icon="ellipsis-h">Misc</NavbarDropdownHeader>
                <NavbarDropdownItem to="/sync-forms">Synchronized forms</NavbarDropdownItem>
                <NavbarDropdownItem to="/users">Complete user form example</NavbarDropdownItem>
            </NavbarDropdown>
            <NavbarItem to="https://github.com/leandrohsilveira/react-formctrl" icon="github" external>GitHub Repository</NavbarItem>
        </Navbar>
    )
}