const path = require('path');
var WebpackTapeRun = require('webpack-tape-run')

const transpileDependencies = [
  'fast-csv'
]

module.exports = {
    target: 'web',
    mode: 'development',
    entry: [path.resolve(__dirname, './tests/angerWord.test.js')],
    node: {
      fs: 'empty'
    },
    output: {
      path: path.resolve(__dirname, './output'),
      filename: 'test.js'
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['*', '.js']
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              // exclude: new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`),
              use: {
                  loader: 'babel-loader'
              }
          }
      ]
  },
  plugins: [
      new WebpackTapeRun({
        tapeRun: {
         browser: 'phantomjs'
        },
        reporter: 'tap-spec'
      })
    ]
  }
