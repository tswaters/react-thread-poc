
const path = require('path')
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = type => {

  let target = null
  let babelEnvTargets = null

  const entry = {}

  const output = {
    path: path.resolve(`./dist/${type}`),
    filename: 'main.js',
    chunkFilename: `${type}.[name].[chunkhash].js`,
    publicPath: '/'
  }

  const externals = []

  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

  switch (type) {
    case 'server':
      target = 'node'
      babelEnvTargets = {node: 'current'}
      entry.main = './src/server.jsx'
      output.libraryTarget = 'commonjs-module'
      externals.push(webpackNodeExternals())
    break
    case 'thread':
      target = 'node'
      babelEnvTargets = {node: 'current'}
      entry.main = './src/server.jsx'
      output.library = 'app'
      output.libraryTarget = 'var'
      externals.push({stream: '{Readable: class{}}'}) // todo: fix this!!!
    break
    case 'client':
      target = 'web'
      babelEnvTargets = {browsers: ['last 2 versions', 'IE 11']}
      entry.main = './src/client.jsx'
      plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: ({resource}) => (/node_modules/).test(resource),
          filename: 'vendor.js'
        })
      )
    break
  }

  if (process.env.NODE_ENV === 'production' && type === 'client') {
    plugins.push(
      new UglifyJSPlugin()
    )
  }

  return {
    name: type,
    entry,
    target,
    node: {
      __dirname: false
    },
    output,
    externals,
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', babelEnvTargets],
            'react'
          ],
          plugins: [
            "transform-runtime",
            "transform-class-properties"
          ]
        }
      }]
    },
    plugins
  }
}

module.exports = [
  config('server'),
  config('thread'),
  config('client')
]
