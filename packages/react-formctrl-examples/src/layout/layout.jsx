import React from 'react'

import { AppMenu } from './menu'
import { AppBanner } from './banner'

function AppFeatures() {
    return (
        <div className="row">
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
            </div>
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
            </div>
            <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
            </div>
        </div>
    )
}

export function AppLayout({url, children}) {
    return (
        <div className="layout">
            <AppBanner />
            <AppMenu url={url} />
            <div className="container">
                {children}
            </div>
        </div>
        
    )

}