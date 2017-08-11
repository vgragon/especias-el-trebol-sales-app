const webpack = require("webpack");
const path = require("path");
const helpers = require("./webpack.helpers.js");

let config = {
    entry: helpers.root("src/app/App.js"),
    resolve: {
        extensions: [".js"],
        modules: [helpers.root("node_modules")],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                use: "url-loader?name=assets/[name].[hash:20].[ext]&limit=10000"
            },
            // -- START: FONT AWESOME -- //
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.html?/,
                exclude: /node_modules/,
                loader: "html-loader"
            }
        ]
    }
};

module.exports = config;
