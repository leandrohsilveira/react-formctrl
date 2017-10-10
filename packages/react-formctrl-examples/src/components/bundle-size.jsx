import React from 'react'

import axios from 'axios'

export class BundleSize extends React.Component {

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
        const {calculated, minified, gzipped} = this.state
        if(calculated) {
            return (
                <div>
                    <div>
                        <img src={`https://img.shields.io/badge/minified-${this.parseKb(minified)} Kb-${this.getMinifiedColor(minified)}.svg`} alt="Minified bundle size"/>
                    </div>
                    <div>
                        <img src={`https://img.shields.io/badge/gzipped-${this.parseKb(gzipped)} Kb-${this.getGzippedColor(gzipped)}.svg`} alt="Gzipped bundle size"/>
                    </div>
                </div>
            )
        }
        return false
    }

}