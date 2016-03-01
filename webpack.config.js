const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const root = p => path.join(__dirname, p)
//const trace = loader => `${root('output-tracer.js')}!${loader}!${root('input-tracer.js')}`
const scan = (extensions) => {
  var files = [];
  extensions.forEach(extension => {
    glob
      .sync(`src/**/*.${extension}`)
      .forEach(file => files.push({from: file, to: file.replace('src/', '')}))
  });
  console.log('webpack.config.js..scan()', files);
  return files;
}

process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = {
  devtool: 'source-map',
  debug: true,

  entry: {
    app: root('src/boot.tsx'),
    vendors: ['es6-shim', 'history', 'd3', 'd3tip', 'jquery', 'jsonp', 'moment', 'react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux', 'redux-thunk', 'whatwg-fetch']
  },

  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['', '.ejs', '.ts', '.tsx', '.js', '.json', '.css', '.less', '.html']
  },

  module: {
    preLoaders: [
      {test: /\.js$/, loader: "source-map-loader"}
    ],
    loaders: [
      {test: /\.(ts|tsx)$/, loader: 'ts!replacer?o=src&r=src.electron'},
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.less$/, loader: 'style!css!less'},
      {test: /\.html$/, loader: 'raw'}
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js', minChunks: Infinity}),
    new CopyWebpackPlugin(scan(['ico', 'svg', 'jpg']).concat([{from: 'src/cname', to: 'cname', toType: 'file'}])),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/Index.ejs',
      inject: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(process.env.ENV),
        'NODE_ENV': JSON.stringify(process.env.ENV)
      }
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
};
