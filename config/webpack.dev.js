const webpackMerge = require("webpack-merge");
const path = require("path");
const METADATA = require("./webpack.metadata.js");
const commonConfiguration = require("./webpack.common.js");
const helpers = require("./webpack.helpers.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");

let config = webpackMerge(commonConfiguration, {
    devtool: "cheap-source-map",
    output: {
        path: helpers.root("dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json-loader'
        }]
    },
    devServer: {
        port: METADATA.port,
        host: METADATA.host,
        contentBase: helpers.root("dist"),
        inline: true,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.ejs",
            chunksSortMode: "dependency",
            files: {
                js: ["bundle.js"]
            }
        })
    ]
});

module.exports = config;
