const path = require('path');
const webpack = require('webpack');
const html_webpack_plugin = require('html-webpack-plugin');
const mini_css_extract_plugin = require('mini-css-extract-plugin'); // TODO: remove w/ webpack 5

const config = {
  mode: 'production',

  entry: {
    app: path.resolve(__dirname, 'app.js'),
  },

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          mini_css_extract_plugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
                plugins: require('cssnano'),
            },
          },
          'fast-sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new html_webpack_plugin({ template: path.resolve(__dirname, 'src/universal-barber.html') }),
    new mini_css_extract_plugin({
      filename: 'app.css',
      sourceMap: false,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: 'app.js.map',
      test: /\.js$/,
    }),
  ],
};

module.exports = config;

