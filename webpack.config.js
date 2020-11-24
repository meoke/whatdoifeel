const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');

const saveConfig = mode => {
    const config = `export const Config = {mode: "${mode}"}
                    export default Config;`
    fs.writeFile("src/js/config.js", config, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = (env, options) => {
    saveConfig(options.mode);
    return {
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
                patterns: [
                    {
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
        }
    }
}