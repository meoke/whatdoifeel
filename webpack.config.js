const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist',
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
             filename: 'index.html',
             template: './src/index.html',
             favicon: "./src/images/favicon.png"
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: './src/about.html',
            favicon: "./src/images/favicon.png"
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: "libs",
                to: "js",
            }, {
                from: "dictionaries", 
                to: "dictionaries"
            },
            {
                from: "src/images", 
                to: "images"
            }]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /libs/],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
      }
};