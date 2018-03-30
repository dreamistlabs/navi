const path = require('path');
const webpack = require('webpack');
const jsonpackage = require('./package.json');

module.exports = {
  entry: './src/navi.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `navi-${jsonpackage["version"]}.min.js`,
    libraryTarget: 'var',
    library: 'Navi'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}