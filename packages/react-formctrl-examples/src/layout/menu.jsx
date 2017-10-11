import React from 'react'

import {Navbar, NavbarItem, NavbarDropdown, NavbarDropdownItem, NavbarDropdownHeader, NavbarDropdownDivider} from '../components/navbar'

export function AppMenu({url}) {
    return (
        <Navbar id="appMenuNavbar" title="RFCTRL" containerClassName="container">
            <NavbarItem to={`${url}`} icon="home">Home</NavbarItem>
            <NavbarItem to={`${url}/fields`} icon="list">Fields usage</NavbarItem>
            <NavbarDropdown text="Examples" icon="code">
                <NavbarDropdownHeader icon="hand-peace-o">Basics</NavbarDropdownHeader>
                <NavbarDropdownItem to={`${url}/basic`}>Simple</NavbarDropdownItem>
                <NavbarDropdownItem to={`${url}/more`}>More of basics</NavbarDropdownItem>
                <NavbarDropdownDivider />

                <NavbarDropdownHeader icon="check-circle">Validation</NavbarDropdownHeader>
                <NavbarDropdownItem to={`${url}/validation`}>Field validation</NavbarDropdownItem>
                <NavbarDropdownItem to={`${url}/custom-validators`}>Custom validators example</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader icon="keyboard-o">Controlling</NavbarDropdownHeader>
                <NavbarDropdownItem to={`${url}/form-control`}>Form control</NavbarDropdownItem>
                <NavbarDropdownItem to={`${url}/form-values-manipulation`}>Form values manipulation</NavbarDropdownItem>
                <NavbarDropdownDivider />
                
                <NavbarDropdownHeader icon="ellipsis-h">Misc</NavbarDropdownHeader>
                <NavbarDropdownItem to={`${url}/sync-forms`}>Synchronized forms</NavbarDropdownItem>
                <NavbarDropdownItem to={`${url}/users`}>Complete user form example</NavbarDropdownItem>
            </NavbarDropdown>
            <NavbarItem to={`https://github.com/leandrohsilveira/react-formctrl`} icon="github" external>GitHub Repository</NavbarItem>
        </Navbar>
    )
}