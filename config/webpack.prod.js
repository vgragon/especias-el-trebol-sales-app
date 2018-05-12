const webpack = require("webpack");
const path = require("path");
const webpackMerge = require("webpack-merge");
const helpers = require("./webpack.helpers");
const commonConfiguration = require("./webpack.common.js");
const METADATA = require("./webpack.metadata.js");

// Plugins
const OccurenceOrderPlugin = require("webpack/lib/optimize/OccurrenceOrderPlugin");
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const NoEmitOnErrorsPlugin = require("webpack/lib/NoEmitOnErrorsPlugin");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let config = webpackMerge(commonConfiguration, {
    devtool: "source-map",
    output: {
        path: helpers.root("dist"),
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        sourceMapFilename: "[name].[chunkhash].map",
        chunkFilename: "[id].[chunkhash].chunk.js"
    },
    plugins: [
        // Webpack gives IDs to identify your modules. With this plugin, Webpack will analyze and prioritize often used modules assigning them the smallest ids.
        new OccurenceOrderPlugin(),

        // Stops the build if there is any error.
        new NoEmitOnErrorsPlugin(),
        new UglifyJsPlugin({
            beautify: false, //prod
            output: {
                comments: false
            }, //prod
            mangle: {
                keep_fnames: true,
                screw_ie8: true
            }, //prod
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false // we need this for lazy v8
            },
            sourceMap: false
        }),

        // Set options for loaders
        new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                htmlLoader: {
                    //minimize: false // workaround for ng2
                    minimize: false,
                    removeAttributeQuotes: false,
                    caseSensitive: true,
                    customAttrSurround: [
                        [/#/, /(?:)/],
                        [/\*/, /(?:)/],
                        [/\[?\(?/, /(?:)/]
                    ],
                    customAttrAssign: [/\)?\]?=/]
                }
            }
        }),
        // Webpack inject scripts and links for us with the HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.ejs",
            chunksSortMode: "dependency",
            metadata: METADATA
        }),
        new DefinePlugin({
            "ENV": JSON.stringify(METADATA.ENV),
            "baseUrl": JSON.stringify(METADATA.baseUrl),
            "carbon": {
                "application_slug": JSON.stringify(METADATA.carbon.application_slug),
                "https": JSON.stringify(METADATA.carbon.https),
                "domain": JSON.stringify(METADATA.carbon.domain)
            }
        })
    ]
});

module.exports = config;
