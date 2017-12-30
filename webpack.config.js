const path = require('path');
const html_plugin = require('html-webpack-plugin');
const extract_text_plugin = require('extract-text-webpack-plugin');

const config = {
  entry: {
    app: path.resolve(__dirname, 'app.js'),
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
      {
        test: /\.scss$/,
        use: extract_text_plugin.extract({
          fallback: 'style-loader',
          use:      ['css-loader', 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [
    new html_plugin({ template: path.resolve(__dirname, 'src/universal-barber.html') }),
    new extract_text_plugin({ filename:'app.css' }),
  ],
};

module.exports = config;
