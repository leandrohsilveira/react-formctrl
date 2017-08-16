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
        vendor: ['react', 'react-dom', 'jquery'],
        bundle: './app.jsx',
    },
    output:  {
        filename:   "[name].js", // the output bundle
        path:       resolve(__dirname, "example/dist")
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
                test:    /\.(css)$/,
                use:     ["style-loader", "css-loader"],
            },
        ],
    },

    plugins:     [
        // new StyleLintPlugin(),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        // new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
        // new webpack.optimize.UglifyJsPlugin(),
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