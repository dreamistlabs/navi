const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/navi.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'navi.min.js',
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