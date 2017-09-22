var compressor = require('node-minify');

compressor.minify({
  compressor: 'uglifyjs',
  input: './lib/**/*.js',
  output: './dist/react-formctrl.min.js',
  callback: console.log
});