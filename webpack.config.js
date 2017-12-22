const path = require('path');
const html_plugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: path.resolve(__dirname, 'src/app.js'),
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  plugins: [
    new html_plugin({ template: path.resolve(__dirname, 'src/app.html') }),
  ],
};

module.exports = config;
