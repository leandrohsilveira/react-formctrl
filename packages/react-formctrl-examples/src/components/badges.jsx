import React from 'react'

import {AjaxGet} from './ajax'

const SNYK_IO_URL = 'https://snyk.io/test/github/leandrohsilveira/react-formctrl/badge.svg'

function parseKb(size) {
    return (size / 1024).toFixed(1)
}

function getMinifiedColor(size) {
    if(size < 20000) {
        return 'brightgreen'
    } else if(size < 30000) {
        return 'green'
    } else if(size < 35000) {
        return 'yellow'
    } else if(size < 40000) {
        return 'orange'
    } else {
        return 'red'
    }
}

function getGzippedColor(size) {
    if(size < 7000) {
        return 'brightgreen'
    } else if(size < 9000) {
        return 'green'
    } else if(size < 11000) {
        return 'yellow'
    } else if(size < 15000) {
        return 'orange'
    } else {
        return 'red'
    }
}

function ShieldsIoBadge({title, content, color, alt}) {
    const SHIELDS_IO_URL = 'https://img.shields.io/badge'
    return <img src={`${SHIELDS_IO_URL}/${title}-${content}-${color}.svg`} alt={alt} />
}

function PackageSizesBadges({data}) {
    if(data) {
        const {minified, gzipped} = data
        return (
            <span>
                <ShieldsIoBadge title="minified" content={`${parseKb(minified)} Kb`} color={getMinifiedColor(minified)} alt="Minified bundle size" />
                <ShieldsIoBadge title="gzipped" content={`${parseKb(gzipped)} Kb`} color={getGzippedColor(gzipped)} alt="Gzipped bundle size" />
            </span>
        )
    }
    return null
}

import "./badges.scss"

export function AppBadges({branch = 'master'}) {
    return (
        <div className="badges">
            <a href={`https://travis-ci.org/leandrohsilveira/react-formctrl?branch=${branch}`}>
                <img src={`https://travis-ci.org/leandrohsilveira/react-formctrl.svg?branch=${branch}`} alt="Travis CI Status"/>
            </a>
            <a href={`https://coveralls.io/github/leandrohsilveira/react-formctrl?branch=${branch}`}>
                <img src={`https://coveralls.io/repos/github/leandrohsilveira/react-formctrl/badge.svg?branch=${branch}`} alt='Coverage Status' />
            </a>
            <AjaxGet url="packages.sizes.json">
                <PackageSizesBadges />
            </AjaxGet>
            <img src={`${SNYK_IO_URL}?targetFile=packages%2Freact-formctrl%2Fpackage.json`} alt="Known Vulnerabilities" />

        </div>
    )
}