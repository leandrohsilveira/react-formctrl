import React from 'react'
import { Link } from 'react-router-dom'

export function AppMenu() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <a className="navbar-brand" href="#">react-formctrl</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" exact to="/">Basic</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/more">More of basics</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/validation">Field validation</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/form-control">Form control</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/sync-forms">Synchronized forms</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/form-values-manipulation">Form values manipulation</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/users">Complete user form example</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}