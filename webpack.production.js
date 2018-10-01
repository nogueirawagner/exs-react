var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./js/app.js",
  output: {
    path: __dirname + "/public/js/",
    publicPath: "/js/",
    filename: "app.min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
}