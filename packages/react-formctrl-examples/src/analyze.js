var packageSize = require('package-size');
var fs = require('fs');
var path = require('path');

var options = {
  output: './output.json'
}

process.argv.forEach((val) => {
  if(/^--.*=/.test(val)) {
    var optSplit = val.split(/\=/)
    var optionName = optSplit[0].replace(/^--/, '')
    var optionValue = optSplit[1]
    options[optionName] = optionValue
  }
})

if(Object.keys(options).length) {
  console.log('Options: ', options)
}

const packageSizeOptions = {
    cache: false,
    externals: [/^react$/, /^prop\-types$/]
}
packageSize('react-formctrl', packageSizeOptions)
    .then(data => {

      fs.truncate(options.output, 0, () => {

        fs.writeFile(options.output, JSON.stringify(data), (err) => {
          if(err) {
            return console.error(err)
          }
          return console.log('Packages sizes writen to output: ', options.output, data)
        })

      })

    })
