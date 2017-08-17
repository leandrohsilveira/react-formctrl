const webpack         = require("webpack");
const {resolve}       = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
        alias: {
            modules: __dirname + '/node_modules'
        }
    },
    entry: {
        'bundle': './app.jsx',
        'vendor': [
            'react', 
            'react-dom', 
            'axios', 
            'react-syntax-highlighter/dist/light', 
            'react-syntax-highlighter/dist/styles',
            'react-syntax-highlighter/dist/languages/javascript',
            'react-syntax-highlighter/dist/languages/json'
        ],
    },
    output:  {
        filename:   "[name].js", // the output bundle
        path:       resolve(__dirname, "docs")
    },
// 
    context: resolve(__dirname, "example"),
    devtool: "inline-source-map",

    devServer: {
        hot:         true, // enable HMR on the server
        contentBase: resolve(__dirname, "example/dist"), // match the output path
        publicPath:  "/" // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test:    /\.(js|jsx)$/,
                use:     ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test:    /\.(css|scss|sass)$/,
                use:     ["style-loader", "css-loader", "sass-loader"],
            }
        ],
    },

    plugins:     [
        // new StyleLintPlugin(),
        // new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        // new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'react-formctrl',
        // }),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    performance: {
        hints: false
    }
};