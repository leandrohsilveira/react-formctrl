import React from 'react'
import Prism from 'prismjs'

function Highlight({children, language, className=''}) {
    const code = Prism.highlight(children, Prism.languages[language], {number: true})
    return (
        <pre>
            <code className={`language-${language} ${className}`} dangerouslySetInnerHTML={{__html: code}} />
        </pre>
    )
}

export function HighlightJson({children}) {
    return <Highlight language="json">{children}</Highlight>
}

export function HighlightJsx({children}) {
    return <Highlight language="jsx" className="line-numbers">{children}</Highlight>
}