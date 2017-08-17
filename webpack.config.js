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
    var isLib = env.profile === 'lib';
    var isExample = isDev || isDocs;

    // Global configs
    var configs = {
        resolve: {
            extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
            alias: {
                modules: __dirname + '/node_modules'
            }
        },
        output: {
            filename: "[name].js", 
            sourceMapFilename: '[name].map'
        },

        module: {
            rules: [
                {
                    test:    /\.(js|jsx)$/,
                    use:     ["babel-loader"],
                    exclude: /node_modules/
                },
            ]
        },

        plugins: [
            // new StyleLintPlugin(),
        ],
        performance: {
            hints: false
        }
    };

    if(isExample) {
        // commons example build configs, activated if is DEV or DOCS.
        configs.context = resolve(__dirname, "example");
        configs.entry = {
            'bundle': './app.jsx',
            'vendor': [
                'react', 
                'react-dom', 
                'axios', 
                'react-highlight', 
            ],
        };
        configs.devtool = "source-map";
        configs.target = 'web';
        configs.module.rules.push({
            test:    /\.(css|scss|sass)$/,
            use:     ["style-loader", "css-loader", "sass-loader"],
        });
        configs.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }));
        configs.plugins.push(new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            inject: 'body'
        }));
        
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
        } else {
            // DOCS build configs
            configs.output.path = resolve(__dirname, "docs");

            configs.plugins.push(new CleanWebpackPlugin(['docs/*'], cleanOptions));
            configs.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
        }
        
    } else if(isLib) {
        configs.context = resolve(__dirname, "src");
        configs.entry = {
            'index': './index.js'
        };
        configs.target = 'node';
        configs.externals = ['react'];

        configs.output.path = __dirname;
        configs.output.library = "react-formctrl";
        configs.output.libraryTarget = "umd";

        configs.plugins.push(new CleanWebpackPlugin(['index.js'], cleanOptions));
        configs.plugins.push(new webpack.optimize.UglifyJsPlugin());
    } else {
        throw "unknown webpack runtime profile"
    }


    return configs;

}