import React from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-json'

function Highlight({children, language}) {
    const code = Prism.highlight(children, Prism.languages[language])
    console.log(code)
    return (
        <pre>
            <code className={`language-${language}`} dangerouslySetInnerHTML={{__html: code}} />
        </pre>
    )
}

export function HighlightJson({children}) {
    return <Highlight language="json">{children}</Highlight>
}

export function HighlightJsx({children, language}) {
    return <Highlight language="jsx">{children}</Highlight>
}