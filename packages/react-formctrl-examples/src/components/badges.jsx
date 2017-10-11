import React from 'react'

import axios from 'axios'

const SHIELDS_IO_URL = 'https://img.shields.io/badge'
const SNYK_IO_URL = 'https://snyk.io/test/github/leandrohsilveira/react-formctrl/badge.svg'

import "./badges.scss"
export class AppBadges extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            calculated: false,
            minified: null,
            gzipped: null
        }
    }

    componentWillMount() {
        const options = {
            externals: [/^react$/, /^prop\-types$/]
        }

        axios.get('/packages.sizes.json')
            .then(({data: {minified, gzipped}}) => this.setState(state => ({calculated: true, minified, gzipped})))
    }

    getMinifiedColor(size) {
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

    getGzippedColor(size) {
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

    parseKb(size) {
        return (size / 1024).toFixed(1)
    }

    render() {
        const {branch = 'master'} = this.props
        const {calculated, minified, gzipped} = this.state
        if(calculated) {
            return (
                <div className="badges">
                    <a href={`https://travis-ci.org/leandrohsilveira/react-formctrl?branch=${branch}`}>
                        <img src={`https://travis-ci.org/leandrohsilveira/react-formctrl.svg?branch=${branch}`} alt="Travis CI Status"/>
                    </a>
                    <a href={`https://coveralls.io/github/leandrohsilveira/react-formctrl?branch=${branch}`}>
                        <img src={`https://coveralls.io/repos/github/leandrohsilveira/react-formctrl/badge.svg?branch=${branch}`} alt='Coverage Status' />
                    </a>
                    <img src={`${SHIELDS_IO_URL}/minified-${this.parseKb(minified)} Kb-${this.getMinifiedColor(minified)}.svg`} alt="Minified bundle size" />
                    <img src={`${SHIELDS_IO_URL}/gzipped-${this.parseKb(gzipped)} Kb-${this.getGzippedColor(gzipped)}.svg`} alt="Gzipped bundle size" />
                    <img src={`${SNYK_IO_URL}?targetFile=packages%2Freact-formctrl%2Fpackage.json`} alt="Known Vulnerabilities" />

                </div>
            )
        }
        return false
    }

}