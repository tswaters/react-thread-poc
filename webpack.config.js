
const path = require('path')
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const WrapperPlugin = require('wrapper-webpack-plugin')

const config = type => (env, argv) => {

  const isProd = argv.mode === 'production'

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
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
    })
  ]

  switch (type) {
    case 'worker-farm':
      target = 'node'
      babelEnvTargets = {targets: {node: 'current'}}
      entry.main = './src/thread.jsx'
      output.libraryTarget = 'commonjs-module'
      externals.push(webpackNodeExternals())
    break
    case 'worker-pool':
      target = 'node'
      babelEnvTargets = {targets: {node: 'current'}}
      entry.main = './src/server.jsx'
      output.libraryTarget = 'commonjs-module'
      output.library = 'app'
      output.libraryTarget = 'var'
      externals.push(webpackNodeExternals())
      plugins.push(new WrapperPlugin({
        test: /\.js$/,
        header: 'var workerpool = require("workerpool");',
        footer: ';workerpool.worker({render: app.render})'
      }))
    break
    case 'server':
      target = 'node'
      babelEnvTargets = {targets: {node: 'current'}}
      entry.main = './src/server.jsx'
      output.libraryTarget = 'commonjs-module'
      externals.push(webpackNodeExternals())
    break
    case 'napajs':
    case 'webworker':
      target = 'node'
      babelEnvTargets = {targets: {node: 'current'}}
      entry.main = './src/server.jsx'
      output.library = 'app'
      output.libraryTarget = 'var'
      externals.push({stream: '{Readable: class{}}'}) // todo: fix this!!!
    break
    case 'client':
      target = 'web'
      babelEnvTargets = {targets: ['last 2 versions', 'IE 11']}
      entry.main = './src/client.jsx'
    break
  }

  return {
    name: type,
    entry,
    target,
    node: {
      __dirname: false
    },
    output,
    devtool: 'none',

    optimization: {
      splitChunks: type !== 'client' ? false : {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            filename: 'vendor.js',
            name: 'vendor',
            enforce: true
          }
        }
      },
      minimize: type === 'client',
      minimizer: [
        new TerserPlugin()
      ]
    },
    externals,
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/env', babelEnvTargets],
            '@babel/react'
          ],
          plugins: [
            "@babel/transform-runtime",
            "@babel/plugin-proposal-class-properties"
          ]
        }
      }]
    },
    plugins
  }
}

module.exports = [
  config('client'),
  config('server'),
  config('webworker'),
  config('napajs'),
  config('worker-farm'),
  config('worker-pool')
]
