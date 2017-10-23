import React from 'react'

import {AjaxGet} from '../components/ajax'
import {Markdown} from './markdown'

function RemoteMarkdown({data}) {
    if(data) {
        return (
            <Markdown>
                {data}
            </Markdown>
        )
    } else {
        return <div>Loading README.md from GitHub...</div>
    }
}

export function ReadMe({path}) {
    return (
        <AjaxGet url={path}>
            <RemoteMarkdown />
        </AjaxGet>
    )
}