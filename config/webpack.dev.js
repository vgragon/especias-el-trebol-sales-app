const webpackMerge = require("webpack-merge");
const path = require("path");

const METADATA = require("./webpack.metadata.js");
const commonConfiguration = require("./webpack.common.js");
const helpers = require("./webpack.helpers.js");

// plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");

let config = webpackMerge(commonConfiguration, {
    devtool: "cheap-source-map",
    output: {
        path: helpers.root("dist"),
        filename: "bundle.js"
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
        new DefinePlugin({
            "ENV": JSON.stringify(METADATA.ENV),
            "baseUrl": JSON.stringify(METADATA.baseUrl),
            "carbon": {
                "application_slug": JSON.stringify(METADATA.carbon.application_slug),
                "https": JSON.stringify(METADATA.carbon.https),
                "domain": JSON.stringify(METADATA.carbon.domain)
            }
        }),
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
