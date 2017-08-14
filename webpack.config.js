const webpack         = require("webpack");
const {resolve}       = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
    },
    entry:   [
        // "react-hot-loader/patch", // activate HMR for React
        // "webpack-dev-server/client?http://localhost:8080",// bundle the client for webpack-dev-server and connect to the provided endpoint
        // "webpack/hot/only-dev-server", // bundle the client for hot reloading, only- means to only hot reload for successful updates
        "./app.jsx" // the entry point of our app
    ],
    output:  {
        filename:   "bundle.js", // the output bundle
        path:       resolve(__dirname, "example/dist"),
        publicPath: "/" // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, 'example'),
    devtool: "inline-source-map",

    devServer: {
        hot:         true, // enable HMR on the server
        contentBase: resolve(__dirname, "dist"), // match the output path
        publicPath:  "/" // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test:    /\.(js|jsx)$/,
                use:     ["babel-loader"],
                exclude: /node_modules/
            },
        ],
    },

    plugins:     [
        // new StyleLintPlugin(),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
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