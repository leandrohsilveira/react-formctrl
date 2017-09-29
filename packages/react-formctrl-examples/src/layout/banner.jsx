import React from 'react'

import img from './logo.png'

export function AppBanner() {
    return (
        <div className="banner">
            <div className="container">
                <div className="logo">
                    <img src={img} alt="logo.png"/>
                </div>
                <div className="text">
                    <h1 className="display-3">React Form CTRL</h1>
                    <p>A lightweight React form library inspired by Angular's forms and Redux-Form.</p>
                </div>
            </div>
        </div>
    )
}