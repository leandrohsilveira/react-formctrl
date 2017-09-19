const webpack         = require("webpack");
const {resolve}       = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
let cleanOptions = {
  root:     __dirname,
  verbose:  true,
  dry:      false
}

module.exports = (env) => {

    var isDev = env.profile === 'dev';
    var isDocs = env.profile === 'docs';
    var isExample = isDev || isDocs;

    // Global configs
    var configs = {
        resolve: {
            extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
            alias: {
                modules: __dirname + '/node_modules'
            }
        },
        context: resolve(__dirname, "src"),
        entry: {
            'bundle': './app.jsx',
            'vendor': [
                'react', 
                'react-dom', 
                'react-router-dom',
                'axios', 
                'react-syntax-highlighter/dist/light', 
                'react-syntax-highlighter/dist/styles',
                'react-syntax-highlighter/dist/languages/javascript',
                'react-syntax-highlighter/dist/languages/json'
            ],
        },
        output: {
            filename: "[name].js", 
            sourceMapFilename: '[name].map'
        },
        devtool: "source-map",
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
            ]
        },

        plugins: [
            // new StyleLintPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
            }),
            new HtmlWebpackPlugin({
                template: 'index.html',
                filename: 'index.html',
                inject: 'body'
            }),
        ],
        performance: {
            hints: false
        }
    };
    if(isDev) {
        // DEV build configs
        configs.output.path = resolve(__dirname, "public");

        configs.devServer = {
            hot: true, // enable HMR on the server
            contentBase: resolve(__dirname, "public"), // match the output path
            publicPath: "/" // match the output `publicPath`
        };

        configs.plugins.push(new webpack.HotModuleReplacementPlugin()); // enable HMR globally
        configs.plugins.push(new webpack.NamedModulesPlugin()); // prints more readable module names in the browser console on HMR updates
    } else if(isDocs) {
        // DOCS build configs
        configs.output.path = resolve(__dirname, "../../docs");
        configs.plugins.push(new CleanWebpackPlugin(['../../docs/*'], cleanOptions));
        configs.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
    } else {
        throw "ERROR: Unknown webpack build profile: " + env.profile;
    }

    return configs;

}