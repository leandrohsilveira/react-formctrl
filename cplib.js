var copy = require('copy');

copy('./package.json', './node_modules/react-formctrl', function(err, file) {
  // exposes the vinyl `file` created when the file is copied
  console.log('done package.json')
});

copy('./lib/*', './node_modules/react-formctrl/lib', function(err, file) {
  // exposes the vinyl `file` created when the file is copied
  console.log('done lib')
});