const path = require('path');
const package = require('./package.json');
const DefinePlugin = require('webpack').DefinePlugin;
const TerserPlugin = require('terser-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs')

require('dotenv').config();

module.exports = (env, options) => {

  const build = options.mode === 'production';
  const version = package.version.substring(0, package.version.lastIndexOf('.'));

  let https = true
  if (process.env.HTTPS_KEY) {
    https = {
      key: fs.readFileSync(process.env.HTTPS_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT)
    }
  }
  return {
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: () => build ? `build.${version}.[contenthash].js` : 'bundle.js'
    },
    devServer: {
      host: 'localhost',
      port: 3000,
      open: true,
      https: https,
      historyApiFallback: {
        index: '/'
      },
      contentBase: path.resolve(__dirname, 'public')
    },
    devtool: build ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
        },
        {
          test: /\.css$/i,
          use: [
            'to-string-loader',
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.GRAPHQL_URL': JSON.stringify(process.env.GRAPHQL_URL),
        'process.env.VIDEO_STREAM_URL': JSON.stringify(process.env.VIDEO_STREAM_URL),
        'process.env.AUTH0_CLIENT': JSON.stringify(process.env.AUTH0_CLIENT),
        'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
        'process.env.AUTH0_CALLBACK': JSON.stringify(process.env.AUTH0_CALLBACK),
        'process.env.AUTH0_AUDIENCE': JSON.stringify(process.env.AUTH0_AUDIENCE)
      }),
      new ErrorOverlayPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        inject: false,
        filename: path.join(__dirname, 'build', 'index.html'),
      }),
      ...(build ?
        [new CopyWebpackPlugin([
          {from: path.join(__dirname, 'public', 'assets'), to: 'assets' }
        ])] : [])
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {output: {comments: false}}
        })
      ]
    }
  };
};
