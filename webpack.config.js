const path = require('path');
const package = require('./package.json');
const DefinePlugin = require('webpack').DefinePlugin;
const TerserPlugin = require('terser-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

require('dotenv').config();

module.exports = (env, options) => {

  const build = options.mode === 'production';
  const version = package.version.substring(0, package.version.lastIndexOf('.'));

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: () => build ? `build.${version}.js` : 'bundle.js'
    },
    devServer: {
      host: 'localhost',
      port: 3000,
      open: true,
      https: true,
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, 'public')
    },
    devtool: build ? false : 'cheap-module-source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        },
      }, {
        test: /\.css$/i,
        use: [
          'to-string-loader',
          'style-loader',
          'css-loader'
        ]
      }]
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
      new ErrorOverlayPlugin()
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