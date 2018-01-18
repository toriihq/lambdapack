const path = require('path')
const Webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = ({ entry }) => ({
  entry: ['babel-polyfill', entry],
  target: 'node',
  output: {
    path: path.resolve('./build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    nodeExternals({
      whitelist: [
        'babel-polyfill'
      ]
    })
  ],
  resolve: {
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        exclude: [/node_modules/]
      }
    ]
  },
  plugins: [
    new NodemonPlugin({
      nodeArgs: process.env.NODE_DEBUG_OPTION ? [ process.env.NODE_DEBUG_OPTION ] : []
    }),
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.DefinePlugin({
      'process.env.WEBPACK': true
    }),
    new Webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false
    })
  ],
  devtool: 'source-map'
})
